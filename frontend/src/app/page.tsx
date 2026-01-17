"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { FeaturePanel } from "@/components/Home/FeaturePanel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle } from "lucide-react";

import { QuestionCard } from "@/components/Home/QuestionCard";
import { supabase } from "@/lib/supabase";
import type { QuestionCardModel } from "@/components/Home/types";
import { toQuestionCardModel } from "@/components/Home/types";

// 画面上のフィルタ状態
type Filter = "all" | "open" | "solved";

export default function Home() {
  // UIの状態 
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // データ取得状態 
  const [questions, setQuestions] = useState<QuestionCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1ページに表示する件数
  const pageSize = 5;

  // 初回のみ：Supabaseから質問一覧を取得 
  useEffect(() => {
    let cancelled = false; 

    async function fetchQuestions() {
      setLoading(true);
      setErrorMsg(null);

      // Supabase: questions を起点に関連テーブルを取得
      const { data, error } = await supabase
        .from("questions")
        .select(
          `
          id,
          title,
          content,
          status,
          created_at,
          profiles (
            id,
            username,
            avatar_url
          ),
          question_tags (
            tags ( name )
          ),
          answers ( count ),
          likes ( count )
        `
        )
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        // 取得失敗：エラー表示＆空配列
        setErrorMsg(error.message);
        setQuestions([]);
        setLoading(false);
        return;
      }

      // DBのrow → QuestionCardで使いやすい形に変換
      const models = (data ?? []).map((row: any) =>
        toQuestionCardModel({
          ...row,
          answer_count: row.answers?.[0]?.count ?? 0,
          like_count: row.likes?.[0]?.count ?? 0,
        })
      );

      setQuestions(models);
      setLoading(false);
    }

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, []);

  // 検索・フィルタ条件が変わったらページを1に戻す 
  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  // 検索・フィルタ適用後の質問一覧
  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return questions.filter((item) => {
      // フィルタ条件
      const okByFilter =
        filter === "all"
          ? true
          : filter === "open"
          ? item.status === "open"
          : item.status === "resolved";

      if (!okByFilter) return false;
      if (!q) return true;

      // タイトル + 抜粋 から検索
      return `${item.title} ${item.excerpt}`.toLowerCase().includes(q);
    });
  }, [questions, filter, searchQuery]);

  // ページ数計算 
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));

  // フィルタで件数が減って totalPages が小さくなった時の補正
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // 現在ページ分の切り出し
  const pagedQuestions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, page, pageSize]);

  // ページボタン表示用・見た目
  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );
  
  const paginationBtnClass = (p?: number) => {
    const isActive = typeof p === "number" && p === page;
    return [
      "h-9 px-4 rounded-lg",
      isActive
        ? "border border-primary text-primary bg-primary/10"
        : "border border-border bg-card hover:bg-muted",
    ].join(" ");
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />

        <main className="w-full flex-1 px-6 py-8">
          <header className="space-y-4">
            <h1 className="text-2xl font-bold">質問一覧</h1>

            <Input
              className="max-w-xl bg-card"
              placeholder="キーワードで質問を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex gap-2">
              <Button onClick={() => setFilter("all")}>すべて</Button>
              <Button onClick={() => setFilter("open")}>
                <Clock className="mr-1 h-4 w-4" />
                未解決
              </Button>
              <Button onClick={() => setFilter("solved")}>
                <CheckCircle className="mr-1 h-4 w-4" />
                解決済
              </Button>
            </div>
          </header>

          <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              {loading ? (
                <Card className="p-6">読み込み中...</Card>
              ) : errorMsg ? (
                <Card className="p-6 text-destructive">
                  Supabaseエラー: {errorMsg}
                </Card>
              ) : (
                <>
                  {pagedQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}

                  <div className="flex gap-2 pt-4">
                    {pages.map((p) => (
                      <Button
                        key={p}
                        className={paginationBtnClass(p)}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* 右側の特徴パネル */}
            <aside className="md:sticky md:top-24">
              <FeaturePanel />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
