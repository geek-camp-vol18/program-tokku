"use client";

import { Card } from "@/components/ui/card";

type Props = {
  questionCount: number;
  answerCount: number;
  bestAnswerCount: number;
  likeReceivedCount: number;
};

const stats = [
  { key: "question", label: "質問", points: "+5pt" },
  { key: "answer", label: "回答", points: "+10pt" },
  { key: "bestAnswer", label: "ベストアンサー", points: "+50pt" },
  { key: "like", label: "共感された", points: "+2pt" },
] as const;

export function StatsCard({
  questionCount,
  answerCount,
  bestAnswerCount,
  likeReceivedCount,
}: Props) {
  const values: Record<string, number> = {
    question: questionCount,
    answer: answerCount,
    bestAnswer: bestAnswerCount,
    like: likeReceivedCount,
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.key} className="p-4 text-center">
          <div className="text-3xl font-bold">{values[stat.key]}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {stat.label} ({stat.points})
          </div>
        </Card>
      ))}
    </div>
  );
}
