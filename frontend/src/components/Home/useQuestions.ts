"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import type { Question } from "@/types/question";
import type { Profile, Rank } from "@/types/user";

import type { Filter, QuestionListItem } from "@/components/Home/homeTypes";
import { dummyQuestions } from "@/components/Home/dummyQuestions";

/**
 * モック切替え
 * .env.local に NEXT_PUBLIC_USE_MOCK=true を入れるとモックになる
 * 本番は false（または未設定）
 */
function shouldUseMock(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true";
}

/** Supabase join の形 */
type ProfileJoined = Pick<Profile, "id" | "username" | "avatar_url"> & {
  ranks?: Pick<Rank, "name"> | null;
};
type QuestionTagJoined = { tags: { name: string } | null };

// 生データの型定義
type QuestionRowJoined = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  status: Question["status"];
  created_at: string;

  profiles: ProfileJoined | null;
  question_tags: QuestionTagJoined[] | null;

  answers: { count: number }[] | null;
  likes: { count: number }[] | null;
};

function normalizeUsername(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s : "名無し";
}

// DBの行データを画面用の QuestionListItem に変換
function toListItem(row: QuestionRowJoined): QuestionListItem {
  const tags: string[] =
    row.question_tags?.map((qt) => qt.tags?.name).filter(Boolean) ?? [];

  const answer_count = row.answers?.[0]?.count ?? 0;
  const like_count = row.likes?.[0]?.count ?? 0;

  const profile = row.profiles;

  return {
    // 基本情報
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    content: row.content,
    image_url: row.image_url ?? null,
    status: row.status,
    created_at: row.created_at,

    answer_count,
    like_count,
    tags,

    // 投稿者情報
    author: {
      id: profile?.id ?? row.user_id ?? "unknown",
      username: normalizeUsername(profile?.username),
      avatar_url: profile?.avatar_url ?? null,
      rank_name: profile?.ranks?.name ?? undefined,
    },
  };
}

// フィルタと検索クエリを適用
function applyFilter(items: QuestionListItem[], filter: Filter, searchQuery: string) {
  const q = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    const okByFilter =
      filter === "all"
        ? true
        : filter === "open"
        ? item.status === "open"
        : item.status === "closed";

    if (!okByFilter) return false;
    if (!q) return true;

    const haystack = [
      item.title,
      item.content,
      item.author.username,
      item.author.rank_name ?? "",
      item.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

// ページネーション適用
function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    totalPages,
    safePage,
    pagedItems: items.slice(start, start + pageSize),
  };
}

// Homeページ（質問一覧）用のデータ取得フック
export function useQuestions(args: {
  filter: Filter;
  searchQuery: string;
  page: number;
  pageSize: number;
}) {
  const { filter, searchQuery, page, pageSize } = args;

  const [raw, setRaw] = useState<QuestionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // データ取得
  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      setLoading(true);
      setErrorMsg(null);

      // モック利用時
      if (shouldUseMock()) {
        if (!cancelled) {
          setRaw(dummyQuestions);
          setLoading(false);
        }
        return;
      }

      // Supabaseから取得
      const { data, error } = await supabase
        .from("questions")
        .select(
          `
          id,
          user_id,
          title,
          content,
          image_url,
          status,
          created_at,

          profiles (
            id,
            username,
            avatar_url,
            rank_id,
            ranks ( id, name )
          ),

          question_tags ( tags ( name ) ),
          answers ( count ),
          likes ( count )
        `
        )
        .order("created_at", { ascending: false });

      if (cancelled) return;

      // エラー時
      if (error) {
        setErrorMsg(error.message);
        setRaw([]);
        setLoading(false);
        return;
      }

      // 成功時
      const rows = (data ?? []) as unknown as QuestionRowJoined[];
      setRaw(rows.map(toListItem));
      setLoading(false);
    }

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, []);

  // フィルタ・検索・ページネーション適用
  const filtered = useMemo(
    () => applyFilter(raw, filter, searchQuery),
    [raw, filter, searchQuery]
  );

  // ページネーション
  const { totalPages, safePage, pagedItems } = useMemo(
    () => paginate(filtered, page, pageSize),
    [filtered, page, pageSize]
  );

  // ページリスト
  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return {
    loading,
    errorMsg,
    items: pagedItems,
    totalPages,
    safePage,
    pages,
  };
}
