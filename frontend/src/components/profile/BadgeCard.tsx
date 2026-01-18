"use client";

import { Card } from "@/components/ui/card";

type Badge = {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  earnedAt: string;
};

type Props = {
  badges: Badge[];
};

// 仮のバッジアイコン（実際のバッジがない場合の表示用）
const PLACEHOLDER_BADGES = [
  { name: "環境構築職人", icon: "🔧" },
  { name: "今週のヒーロー", icon: "🦸" },
  { name: "初めての解決", icon: "🎉" },
  { name: "いいね100", icon: "❤️" },
];

export function BadgeCard({ badges }: Props) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">獲得バッジ</h3>

      {badges.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="text-2xl mb-1">
                {badge.iconUrl ? (
                  <img src={badge.iconUrl} alt={badge.name} className="h-8 w-8" />
                ) : (
                  "🏆"
                )}
              </div>
              <span className="text-xs text-center text-muted-foreground">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        // バッジがない場合はプレースホルダーを表示（グレーアウト）
        <div className="grid grid-cols-2 gap-3">
          {PLACEHOLDER_BADGES.map((badge) => (
            <div
              key={badge.name}
              className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/20 opacity-40"
            >
              <div className="text-2xl mb-1 grayscale">{badge.icon}</div>
              <span className="text-xs text-center text-muted-foreground">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
