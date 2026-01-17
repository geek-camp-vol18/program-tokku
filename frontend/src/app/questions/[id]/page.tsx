"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";

import { supabase } from "@/lib/supabase";
import { useQuestionDetail } from "@/components/questions/useQuestionDetail";
import { QuestionDetailCard } from "@/components/questions/QuestionDetailCard";
import { AskerCard } from "@/components/questions/AskerCard";
import { AnswerSection } from "@/components/questions/AnswerSection";

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, loading, errorMsg, refetch } = useQuestionDetail(id);

  // 回答投稿後にデータを再取得
  const handleAnswerPosted = useCallback(() => {
    refetch();
  }, [refetch]);

  // ベストアンサー選択
  const handleBestAnswerSelected = useCallback(async (answerId: string) => {
    if (!id) return;

    // 1. 回答をベストアンサーに設定
    const { error: updateError } = await supabase
      .from("answers")
      .update({ is_best_answer: true })
      .eq("id", answerId);

    if (updateError) {
      console.error("Best answer update error:", updateError.message);
      alert("ベストアンサーの設定に失敗しました");
      return;
    }

    // 2. 質問のステータスを解決済みに変更
    const { error: statusError } = await supabase
      .from("questions")
      .update({ status: "closed" })
      .eq("id", id);

    if (statusError) {
      console.error("Question status update error:", statusError.message);
    }

    // 3. データを再取得
    refetch();
  }, [id, refetch]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="px-6 py-8 max-w-7xl mx-auto">
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
                  <Card className="p-6 text-destructive">
                    エラー: {errorMsg}
                  </Card>
                ) : !data ? (
                  <Card className="p-6">質問が見つかりませんでした</Card>
                ) : (
                  <>
                    <QuestionDetailCard
                      question={data.question}
                      tags={data.tags}
                      answerCount={data.answerCount}
                      likeCount={data.likeCount}
                      asker={{
                        username: data.asker.username ?? "名無し",
                        rankName: data.asker.rankName,
                      }}
                    />

                    <AnswerSection
                      questionId={data.question.id}
                      questionUserId={data.question.user_id}
                      answers={data.answers}
                      onAnswerPosted={handleAnswerPosted}
                      onBestAnswerSelected={handleBestAnswerSelected}
                    />
                  </>
                )}
              </section>

              {/* 質問者情報サイドバー */}
              <aside className="space-y-6 md:sticky md:top-24">
                {data ? <AskerCard profile={data.asker} /> : null}
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
