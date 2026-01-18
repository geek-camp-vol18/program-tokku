"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { FeaturePanel } from "@/components/Home/FeaturePanel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, MessageCircleQuestion } from "lucide-react";

import { QuestionCard } from "@/components/Home/QuestionCard";
import { useQuestions, type Filter } from "@/components/Home/useQuestions";

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const { items, loading, errorMsg, pages, safePage } = useQuestions({
    filter,
    searchQuery,
    page,
    pageSize,
  });

  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  const paginationBtnClass = (p?: number) => {
    const isActive = typeof p === "number" && p === page;
    return [
      "h-9 px-4 rounded-lg",
      isActive
        ? "border border-primary text-primary bg-primary/10"
        : "border border-border bg-card text-foreground hover:bg-muted",
    ].join(" ");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="px-6 py-8 max-w-7xl mx-auto">
            <header className="space-y-4">
              <h1 className="text-2xl font-bold">質問一覧</h1>

              <Input
                className="max-w-xl bg-card focus-visible:ring-primary"
                placeholder="キーワードで質問を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  すべて
                </Button>

                <Button
                  variant={filter === "open" ? "default" : "outline"}
                  onClick={() => setFilter("open")}
                >
                  <Clock className="mr-1 h-4 w-4" />
                  未解決
                </Button>

                <Button
                  variant={filter === "solved" ? "default" : "outline"}
                  onClick={() => setFilter("solved")}
                >
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
                ) : items.length === 0 ? (
                  <Card className="p-8 text-center">
                    <MessageCircleQuestion className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      {searchQuery
                        ? "検索条件に一致する質問がありません"
                        : "質問がまだありません"}
                    </p>
                  </Card>
                ) : (
                  <>
                    {items.map((q) => (
                      <QuestionCard key={q.id} question={q} />
                    ))}

                    {pages.length > 1 && (
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
                    )}
                  </>
                )}
              </section>

              {/* 右側特徴パネル */}
              <aside className="md:sticky md:top-24">
                <FeaturePanel />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
