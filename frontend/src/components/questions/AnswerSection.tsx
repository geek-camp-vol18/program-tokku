"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, Code, Send } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { AnswerCard, type AnswerRow } from "@/components/questions/AnswerCard";

type Props = {
  questionId: string;
  questionUserId: string;
  answers: AnswerRow[];
  onAnswerPosted: () => void;
  onBestAnswerSelected: (answerId: string) => void;
};

export function AnswerSection({
  questionId,
  questionUserId,
  answers,
  onAnswerPosted,
  onBestAnswerSelected,
}: Props) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 現在のユーザーを取得
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("回答内容を入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // ユーザー確認
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("回答するにはログインが必要です");
      setIsSubmitting(false);
      return;
    }

    // 回答を投稿
    const { error: insertError } = await supabase.from("answers").insert({
      id: crypto.randomUUID(),
      question_id: questionId,
      user_id: userData.user.id,
      content: content.trim(),
      is_best_answer: false,
    });

    if (insertError) {
      console.error("Answer insert error:", insertError.message);
      setError("回答の投稿に失敗しました");
      setIsSubmitting(false);
      return;
    }

    // 成功
    setContent("");
    setIsSubmitting(false);
    onAnswerPosted();
  };

  const isQuestionOwner = currentUserId === questionUserId;
  const hasBestAnswer = answers.some((a) => a.is_best_answer);

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground">
        回答（{answers.length}件）
      </div>

      {answers.length === 0 ? (
        <Card className="p-5 text-sm text-muted-foreground">まだ回答はありません</Card>
      ) : (
        <div className="space-y-4">
          {answers.map((a) => (
            <AnswerCard
              key={a.id}
              answer={a}
              showBestAnswerButton={isQuestionOwner && !hasBestAnswer && !a.is_best_answer}
              onSelectBestAnswer={() => onBestAnswerSelected(a.id)}
            />
          ))}
        </div>
      )}

      {/* 回答投稿フォーム */}
      <Card className="p-6 space-y-4">
        <div className="font-medium">回答を投稿する</div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <Textarea
          placeholder="回答内容を入力..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
              <Paperclip className="h-4 w-4" />
              ファイル添付
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
              <Code className="h-4 w-4" />
              コード挿入
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                投稿中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                回答を投稿
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
