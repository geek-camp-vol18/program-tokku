"use client";

import { useParams } from "next/navigation";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";

import { useQuestionDetail } from "@/components/questions/useQuestionDetail";
import { QuestionDetailCard } from "@/components/questions/QuestionDetailCard";
import { AskerCard } from "@/components/questions/AskerCard";
import { AnswerSection } from "@/components/questions/AnswerSection";

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, loading, errorMsg } = useQuestionDetail(id);

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />
        
        <main className="w-full flex-1 px-6 py-8">
          <div className="text-xs text-muted-foreground mb-4">
            <span className="text-muted-foreground">ホーム / </span>
            <span className="text-muted-foreground">質問一覧 / </span>
            <span className="text-foreground font-medium">質問詳細</span>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <section className="space-y-6">
            {/* 質問詳細・回答セクション */}
              {loading ? (
                <Card className="p-6">読み込み中...</Card>
              ) : errorMsg ? (
                <Card className="p-6 text-destructive">Supabaseエラー: {errorMsg}</Card>
              ) : !data ? (
                <Card className="p-6">質問が見つかりませんでした</Card>
              ) : (
                <>
                  <QuestionDetailCard
                    question={data.question}
                    tags={data.tags}
                    answerCount={data.answerCount}
                    likeCount={data.likeCount}
                    asker={{ username: data.asker.username ?? "名無し", rankName: data.asker.rankName }}
                  />

                  <AnswerSection answers={data.answers} />
                </>
              )}
            </section>

            {/* 質問者情報サイドバー */}
            <aside className="space-y-6 md:sticky md:top-24">
              {data ? <AskerCard profile={data.asker} /> : null}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
