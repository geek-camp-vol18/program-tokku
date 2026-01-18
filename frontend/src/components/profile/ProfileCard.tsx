"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Trophy } from "lucide-react";
import type { ProfileData } from "@/hooks/useProfile";

type Props = {
  profile: ProfileData;
};

export function ProfileCard({ profile }: Props) {
  const initial = profile.username.charAt(0).toUpperCase() || "?";
  const pointsToNext = profile.nextRank
    ? profile.nextRank.minPoints - profile.points
    : 0;

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        {/* アバター */}
        <div className="h-24 w-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl font-bold shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </div>

        {/* ユーザー情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <Badge className="rounded-full bg-emerald-500 text-white">
              {profile.currentRank.name}
            </Badge>
          </div>

          <p className="text-muted-foreground mt-1">@{profile.username}</p>

          {/* ポイント */}
          <div className="flex items-center gap-2 mt-3">
            <Zap className="h-5 w-5 text-emerald-500" />
            <span className="text-3xl font-bold">{profile.points}</span>
            <span className="text-xl text-muted-foreground">pt</span>
          </div>

          {/* 次のランクまでの進捗 */}
          {profile.nextRank && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4" />
                <span>
                  次のランク: {profile.nextRank.icon} {profile.nextRank.name}
                </span>
                <span className="ml-auto">
                  {profile.points} / {profile.nextRank.minPoints}
                </span>
              </div>

              {/* プログレスバー */}
              <div className="mt-2 h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-orange-400"
                  style={{ width: `${profile.progressToNextRank}%` }}
                />
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                あと{pointsToNext}ptで「{profile.nextRank.name}」に昇格!
              </p>
            </div>
          )}

          {/* 最高ランクに達している場合 */}
          {!profile.nextRank && (
            <p className="mt-4 text-sm text-emerald-600 font-medium">
              最高ランクに達しています!
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
