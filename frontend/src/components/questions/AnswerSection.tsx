"use client";

// 回答セクションコンポーネント
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { AnswerCard, type AnswerRow } from "@/components/questions/AnswerCard";

type Props = {
  answers: AnswerRow[];
};

export function AnswerSection({ answers }: Props) {
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
            <AnswerCard key={a.id} answer={a} />
          ))}
        </div>
      )}

      {/* 投稿フォーム（最小：送信処理は後で） */}
      <Card className="p-6 space-y-3">
        <div className="text-sm font-medium">回答を投稿する</div>
        <Textarea placeholder="回答内容を入力..." />
        <div className="flex justify-end">
          <Button disabled>投稿（準備中）</Button>
        </div>
      </Card>
    </div>
  );
}
