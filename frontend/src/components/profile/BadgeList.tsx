"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BadgeList() {
  const badges = [
    { name: "環境構築職人", acquired: false },
    { name: "今週のヒーロー", acquired: false },
    { name: "初めての解決", acquired: false },
    { name: "いいね100", acquired: false },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          獲得バッジ
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="flex flex-col items-center gap-2.5"
            >
              <div
                className={`w-16 h-16 rounded-lg border-2 transition-colors ${
                  badge.acquired
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/50 border-border"
                }`}
              />
              <p className="text-xs text-center text-muted-foreground leading-tight">
                {badge.name}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}