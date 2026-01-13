"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ShieldCheck, Zap, Trophy, Clock, CheckCircle } from "lucide-react";

type Filter = "all" | "open" | "solved";

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const placeholderCards = useMemo(() => Array.from({ length: 6 }), []);

  // ページネーション（見た目）
  const [page, setPage] = useState<number>(1);
  const pages = [1, 2, 3];

  const paginationBtnClass = (p?: number) => {
    const isActive = typeof p === "number" && p === page;
    return [
      "h-9 px-4 rounded-lg",
      isActive
        ? "border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-50"
        : "hover:bg-muted",
    ].join(" ");
  };

  return (
    <div className="min-h-screen bg-muted/60">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
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

        {/* 左 2/3 : 右 1/3 */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
          {/* 左：質問一覧 */}
          <section className="space-y-4">
            {placeholderCards.map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">
                    （仮）質問タイトルが入ります
                  </CardTitle>
                  <CardDescription>
                    （仮）タグ・投稿者・回答数などが入ります
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}

            {/* ページネーション */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm border">
                <Button
                  variant="ghost"
                  className={paginationBtnClass()}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  onClick={() => setPage((p) => Math.min(pages.length, p + 1))}
                >
                  次へ
                </Button>
              </div>
            </div>
          </section>

          {/* 右：特徴カード（lucide-react版） */}
          <aside className="h-fit md:sticky md:top-6">
            <FeaturePanel />
          </aside>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-semibold leading-6">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

function FeaturePanel() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">プログラム特区の特徴</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        <FeatureItem
          icon={<ShieldCheck className="h-5 w-5" />}
          title="初心者にやさしい"
          description="どんな質問でも歓迎。みんな最初は初心者でした。"
        />
        <FeatureItem
          icon={<Zap className="h-5 w-5" />}
          title="ポイントで成長"
          description="質問・回答・解決でポイントGET。ランクアップを目指そう！"
        />
        <FeatureItem
          icon={<Trophy className="h-5 w-5" />}
          title="称号・バッジ"
          description="活動に応じてバッジを獲得。あなたの実績を証明します。"
        />
      </CardContent>
    </Card>
  );
}
