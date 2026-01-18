"use client";

import { Card, CardContent } from "@/components/ui/card";

export function BadgeList() {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <h3 className="text-sm font-semibold">バッジ</h3>
        <p className="text-sm text-muted-foreground">
          まだバッジはありません。
        </p>
      </CardContent>
    </Card>
  );
}