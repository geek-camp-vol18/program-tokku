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
import type { QuestionCardModel, QuestionRow } from "@/components/Home/types";
import { toQuestionCardModel } from "@/components/Home/types";

type Filter = "all" | "open" | "solved"; // solved = resolved を表示上そう呼ぶ

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Supabase取得データ（UI用）
  const [questions, setQuestions] = useState<QuestionCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pageSize = 5;

  // 初回：Supabaseから質問一覧を取得
  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("questions")
        .select(
          `
            id,
            title,
            content,
            status,
            created_at,
            answer_count,
            like_count,
            profiles (
              id,
              username,
              avatar_url
            ),
            question_tags (
              tags ( name )
            )
          `
        )
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        // ここにRLS/キー間違い等のエラーが出るので「Supabaseが使えるか」が判定できる
        setErrorMsg(error.message);
        setQuestions([]);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as unknown as QuestionRow[];
      const models = rows.map(toQuestionCardModel);

      setQuestions(models);
      setLoading(false);
    }

    fetchQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  // 検索・フィルタが変わったら1ページ目に戻す
  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  // filter + search
  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return questions.filter((item) => {
      const okByFilter =
        filter === "all"
          ? true
          : filter === "open"
          ? item.status === "open"
          : item.status === "resolved";

      if (!okByFilter) return false;

      if (q.length === 0) return true;

      const haystack = `${item.title} ${item.excerpt}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [questions, filter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));

  // フィルタ結果が減ってページがはみ出したら丸める
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedQuestions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, page, pageSize]);

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const paginationBtnClass = (p?: number) => {
    const isActive = typeof p === "number" && p === page;
    return [
      "h-9 px-4 rounded-lg",
      isActive
        ? "border border-primary text-primary bg-primary/10 hover:bg-primary/10"
        : "border border-border bg-card hover:bg-muted",
    ].join(" ");
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />

        <main className="w-full flex-1 px-6 py-8">
          <header className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">質問一覧</h1>
              <p className="text-sm text-muted-foreground">
                みんなの疑問を解決しよう
              </p>
            </div>

            {/* 検索 */}
            <div className="max-w-xl">
              <Input
                className="bg-card"
                placeholder="キーワードで質問を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* フィルタ */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                すべて
              </Button>
              <Button
                variant={filter === "open" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("open")}
                className="flex items-center gap-1.5"
              >
                <Clock className="h-4 w-4" />
                未解決
              </Button>
              <Button
                variant={filter === "solved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("solved")}
                className="flex items-center gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                解決済
              </Button>
            </div>
          </header>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
            {/* 左：質問一覧 */}
            <section className="space-y-4">
              {loading ? (
                <Card className="bg-card p-6 text-sm text-muted-foreground">
                  読み込み中...
                </Card>
              ) : errorMsg ? (
                <Card className="border-destructive/40 bg-card p-6 text-sm text-destructive">
                  Supabase取得エラー: {errorMsg}
                  <div className="mt-2 text-xs text-muted-foreground">
                    ※RLSが原因の場合は、questions / profiles / tags周りのSELECTポリシーが必要です
                  </div>
                </Card>
              ) : filteredQuestions.length === 0 ? (
                <Card className="border-dashed bg-card p-6 text-sm text-muted-foreground">
                  該当する質問がありません
                </Card>
              ) : (
                <>
                  {pagedQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}

                  {/* ページネーション */}
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
                      <Button
                        variant="ghost"
                        className={paginationBtnClass()}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={isPrevDisabled}
                      >
                        前へ
                      </Button>

                      {pages.map((p) => (
                        <Button
                          key={p}
                          variant="ghost"
                          className={paginationBtnClass(p)}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ))}

                      <Button
                        variant="ghost"
                        className={paginationBtnClass()}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={isNextDisabled}
                      >
                        次へ
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* 右：特徴カード */}
            <aside className="h-fit md:sticky md:top-24">
              <FeaturePanel />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
