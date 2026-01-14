"use client";

import { useMemo, useEffect, useMemo as _useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { FeaturePanel } from "@/components/home/FeaturePanel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle } from "lucide-react";

import { QuestionCard } from "@/components/questions/QuestionCard";
import type { Question } from "@/components/questions/types";
import { getDummyQuestions } from "@/components/questions/dummyQuestions";

type Filter = "all" | "open" | "solved";

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const questions: Question[] = useMemo(() => getDummyQuestions(), []);

  // ページネーション（動く版）
  const [page, setPage] = useState<number>(1);
  const pageSize = 5; // ← ここで 5/6/10 など調整OK

  // 検索・フィルタが変わったら1ページ目に戻す（UX的に自然）
  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  // filter + search
  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return questions.filter((item) => {
      // filter
      const okByFilter =
        filter === "all"
          ? true
          : filter === "open"
          ? item.status === "open"
          : item.status === "resolved";

      if (!okByFilter) return false;

      // search (title + excerpt)
      if (q.length === 0) return true;

      const haystack = `${item.title} ${item.excerpt}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [questions, filter, searchQuery]);

  // 総ページ数（最低1）
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));

  // フィルタ結果が減ってページがはみ出したら丸める
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // paging
  const pagedQuestions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, page, pageSize]);

  // ページ番号を自動生成
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const paginationBtnClass = (p?: number) => {
    const isActive = typeof p === "number" && p === page;
    return [
      "h-9 px-4 rounded-lg",
      isActive
        ? "border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-50"
        : "hover:bg-muted",
    ].join(" ");
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div className="min-h-screen bg-muted/60">
      {/* 共通ヘッダー */}
      <Header />

      {/* ヘッダー下：サイドバー + メイン */}
      <div className="mx-auto flex w-full max-w-7xl">
        {/* 共通サイドバー（lg以上で表示） */}
        <Sidebar />

        {/* メインコンテンツ */}
        <main className="w-full flex-1 px-6 py-8">
          {/* 上部 */}
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
                className="bg-white"
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

          {/* 中央（質問一覧 + 右カード） */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
            {/* 左：質問一覧 */}
            <section className="space-y-4">
              {/* Empty */}
              {filteredQuestions.length === 0 ? (
                <Card className="border-dashed bg-white p-6 text-sm text-muted-foreground">
                  該当する質問がありません
                </Card>
              ) : (
                <>
                  {pagedQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}

                  {/* ページネーション */}
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 rounded-xl border bg-white p-2 shadow-sm">
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
                          variant="outline"
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
