"use client";

import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Zap, Trophy } from "lucide-react";

export function FeaturePanel() {
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

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
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
