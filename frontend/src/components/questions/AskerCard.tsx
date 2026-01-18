"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/user";

type Props = {
  profile: Pick<Profile, "id" | "username" | "points" | "solved_count" | "answer_count"> & {
    rankName?: string | null;
  };
};

function safeName(name: string | null | undefined) {
  const s = (name ?? "").trim();
  return s || "名無し";
}

function calcSolveRate(solved: number, answers: number) {
  if (answers <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((solved / answers) * 100)));
}

export function AskerCard({ profile }: Props) {
  const name = safeName(profile.username);
  const initial = name.charAt(0) || "?";
  const rate = calcSolveRate(profile.solved_count, profile.answer_count);

  return (
    <Card className="p-5 space-y-4">
      <div className="text-sm font-semibold">質問者について</div>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">@{name}</div>
          <div className="text-xs text-muted-foreground">質問解決率: {rate}%（参考）</div>
        </div>
      </div>

      <Link href={`/profile/${profile.id}`}>
        <Button variant="outline" className="w-full">
          プロフィールを見る
        </Button>
      </Link>
    </Card>
  );
}
