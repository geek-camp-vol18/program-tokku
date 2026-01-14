"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { label: "質問", value: 8, sub: "+5pt" },
  { label: "回答", value: 25, sub: "+10pt" },
  { label: "ベストアンサー", value: 12, sub: "+50pt" },
  { label: "共感された", value: 35, sub: "+2pt" },
];

export function ProfileOverview() {
  const currentPoint = 470;
  const nextRankPoint = 500;
  const progress = (currentPoint / nextRankPoint) * 100;

  return (
    // ここから全部ひとつの Card の中に収める
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* 上段：アイコン＋名前＋ランク */}
        <div className="flex items-center gap-4">
          <Avatar className="h-18 w-18 bg-secondary text-primary">
            <AvatarFallback className="text-2xl">Y</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">山田太郎</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                ビギナー
              </span>
            </div>
            <p className="text-sm text-muted-foreground">@yamada</p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-primary">⚡ {currentPoint} pt</p>
            <p className="text-xs text-muted-foreground">
              次のランク: デベロッパー
            </p>
          </div>
        </div>

        {/* 中段：ランク プログレスバー */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              次のランク：
              <span className="font-semibold text-foreground">デベロッパー</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {currentPoint} / {nextRankPoint} pt
            </p>
          </div>
          <Progress value={progress} className="h-2.5 bg-primary/15" />
          <p className="text-xs text-muted-foreground mt-1">
            あと {nextRankPoint - currentPoint} pt で昇格！
          </p>
        </div>

        {/* 下段：4つの統計（名前カードの中に収める） */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-white/80 border border-border px-4 py-3"
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-primary font-semibold mt-0.5">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
