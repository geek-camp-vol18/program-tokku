"use client";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "質問", value: 8, sub: "+5pt" },
  { label: "回答", value: 25, sub: "+10pt" },
  { label: "ベストアンサー", value: 12, sub: "+50pt" },
  { label: "共感された", value: 35, sub: "+2pt" },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
        {stats.map((stat) => (
            <Card key={stat.label} className="border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-extrabold text-foreground leading-tight">{stat.value}</p>
                 <p className="text-xs text-primary font-semibold mt-1">{stat.sub}</p>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}