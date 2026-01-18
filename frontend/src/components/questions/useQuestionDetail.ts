"use client";

// 質問詳細取得用のカスタムフック
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import type { Question } from "@/types/question";
import type { Profile } from "@/types/user";
import type { Answer } from "@/types/answer";

import { dummyQuestions } from "@/components/Home/dummyQuestions";
import type { QuestionListItem } from "@/components/Home/homeTypes";
import type { AnswerRow } from "@/components/questions/AnswerCard";

/**
 * モック切替
 * NEXT_PUBLIC_USE_MOCK=true のときは DB を叩かない
 */
function shouldUseMock(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true";
}

/**
 * UUID 判定（Supabase に投げる前のガード）
 */
function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

/**
 * 詳細画面で使う最終データ形
 */
export type QuestionDetailData = {
  question: Question;
  tags: string[];
  answerCount: number;
  likeCount: number;
  asker: Pick<
    Profile,
    "id" | "username" | "points" | "solved_count" | "answer_count"
  > & {
    rankName?: string | null;
  };
  answers: AnswerRow[];
};

/* ---------- Supabase join 用の最小型 ---------- */

type ProfileJoined = Pick<
  Profile,
  "id" | "username" | "avatar_url" | "points" | "solved_count" | "answer_count"
> & {
  ranks?: { name: string | null } | null;
};

type AnswerJoined = Answer & {
  profiles: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    ranks?: { name: string | null } | null;
  } | null;
};

type QuestionJoined = Question & {
  profiles: ProfileJoined | null;
  question_tags: Array<{ tags: { name: string } | null }> | null;
  answers: AnswerJoined[] | null;
  likes: { count: number }[] | null;
};

/* ---------- モック変換 ---------- */

function mockToDetail(found: QuestionListItem): QuestionDetailData {
  return {
    question: {
      id: found.id,
      user_id: found.user_id,
      title: found.title,
      content: found.content,
      image_url: found.image_url ?? null,
      status: found.status,
      category: null,
      created_at: found.created_at,
    },
    tags: found.tags,
    answerCount: found.answer_count,
    likeCount: found.like_count,
    asker: {
      id: found.author.id,
      username: found.author.username,
      points: 0,
      solved_count: 0,
      answer_count: 0,
      rankName: found.author.rank_name ?? null,
    },
    answers: [], // モックでは一旦なし
  };
}

/* ---------- Hook 本体 ---------- */

export function useQuestionDetail(id: string | undefined) {
  const [data, setData] = useState<QuestionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!id) return;

      setLoading(true);
      setErrorMsg(null);

      /* --- モック --- */
      if (shouldUseMock()) {
        const found = dummyQuestions.find((q) => q.id === id);
        if (!cancelled) {
          setData(found ? mockToDetail(found) : null);
          setLoading(false);
        }
        return;
      }

      /* --- UUID ガード --- */
      if (!isUuid(id)) {
        if (!cancelled) {
          setErrorMsg("不正なID形式です");
          setData(null);
          setLoading(false);
        }
        return;
      }

      /* --- Supabase --- */
      const { data: row, error } = await supabase
        .from("questions")
        .select(
          `
          id,
          user_id,
          title,
          content,
          image_url,
          status,
          category,
          created_at,

          profiles (
            id,
            username,
            avatar_url,
            points,
            solved_count,
            answer_count,
            ranks ( name )
          ),

          question_tags ( tags ( name ) ),

          answers (
            id,
            question_id,
            user_id,
            content,
            created_at,
            is_best_answer,
            profiles (
              id,
              username,
              avatar_url,
              ranks ( name )
            )
          ),

          likes ( count )
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setErrorMsg(error.message);
        setData(null);
        setLoading(false);
        return;
      }

      if (!row) {
        setData(null);
        setLoading(false);
        return;
      }

      const r = row as unknown as QuestionJoined;

      /* --- 整形 --- */

      const tags =
        r.question_tags
          ?.map((qt) => qt.tags?.name)
          .filter((t): t is string => !!t) ?? [];

      const answers: AnswerRow[] =
        r.answers?.map((a) => ({
          id: a.id,
          question_id: a.question_id,
          user_id: a.user_id,
          content: a.content,
          created_at: a.created_at,
          is_best_answer: a.is_best_answer,
          profiles: a.profiles
            ? {
                id: a.profiles.id,
                username: a.profiles.username,
                avatar_url: a.profiles.avatar_url,
                ranks: a.profiles.ranks ?? null,
              }
            : null,
        })) ?? [];

      const likeCount = r.likes?.[0]?.count ?? 0;

      setData({
        question: {
          id: r.id,
          user_id: r.user_id,
          title: r.title,
          content: r.content,
          image_url: r.image_url,
          status: r.status,
          category: (r as QuestionJoined & { category?: string | null }).category ?? null,
          created_at: r.created_at,
        },
        tags,
        answerCount: answers.length,
        likeCount,
        asker: {
          id: r.profiles?.id ?? r.user_id,
          username: r.profiles?.username ?? "名無し",
          points: r.profiles?.points ?? 0,
          solved_count: r.profiles?.solved_count ?? 0,
          answer_count: r.profiles?.answer_count ?? 0,
          rankName: r.profiles?.ranks?.name ?? null,
        },
        answers,
      });

      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  return { data, loading, errorMsg, refetch };
}
