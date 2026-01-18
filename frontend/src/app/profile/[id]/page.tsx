"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Trophy } from "lucide-react";

import { supabase } from "@/lib/supabase";

// ランク定義
const RANKS = [
  { name: "ビギナー", minPoints: 0, icon: "🌱" },
  { name: "デベロッパー", minPoints: 500, icon: "💻" },
  { name: "ウィザード", minPoints: 1000, icon: "🧙" },
];

function getRankInfo(points: number) {
  let currentRank = RANKS[0];
  let nextRank: (typeof RANKS)[0] | null = null;

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].minPoints) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
      break;
    }
  }

  let progressToNextRank = 100;
  if (nextRank) {
    const currentMin = currentRank.minPoints;
    const nextMin = nextRank.minPoints;
    progressToNextRank = Math.min(
      100,
      Math.floor(((points - currentMin) / (nextMin - currentMin)) * 100)
    );
  }

  return { currentRank, nextRank, progressToNextRank };
}

interface ProfileData {
  id: string;
  username: string;
  avatarUrl: string | null;
  points: number;
  currentRank: { name: string; icon: string };
  nextRank: { name: string; icon: string; minPoints: number } | null;
  progressToNextRank: number;
  questionCount: number;
  answerCount: number;
  bestAnswerCount: number;
  likeReceivedCount: number;
}

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // プロフィール情報を取得
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          throw new Error("ユーザーが見つかりません");
        }

        // 質問数を取得
        const { count: questionCount } = await supabase
          .from("questions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        // 回答数を取得
        const { count: answerCount } = await supabase
          .from("answers")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        // ベストアンサー数を取得
        const { count: bestAnswerCount } = await supabase
          .from("answers")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("is_best_answer", true);

        // 共感された数を取得
        const { data: userQuestions } = await supabase
          .from("questions")
          .select("id")
          .eq("user_id", userId);

        let likeReceivedCount = 0;
        if (userQuestions && userQuestions.length > 0) {
          const questionIds = userQuestions.map((q) => q.id);
          const { count } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .in("question_id", questionIds);
          likeReceivedCount = count || 0;
        }

        const { currentRank, nextRank, progressToNextRank } = getRankInfo(
          profile.points || 0
        );

        setData({
          id: profile.id,
          username: profile.username || "名無し",
          avatarUrl: profile.avatar_url,
          points: profile.points || 0,
          currentRank,
          nextRank,
          progressToNextRank,
          questionCount: questionCount || 0,
          answerCount: answerCount || 0,
          bestAnswerCount: bestAnswerCount || 0,
          likeReceivedCount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const initial = data?.username?.charAt(0).toUpperCase() || "?";
  const pointsToNext = data?.nextRank
    ? data.nextRank.minPoints - data.points
    : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="px-6 py-8 max-w-5xl mx-auto">
            {loading ? (
              <Card className="p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </Card>
            ) : error ? (
              <Card className="p-6 text-destructive">{error}</Card>
            ) : data ? (
              <div className="space-y-6">
                {/* プロフィールカード */}
                <Card className="p-6">
                  <div className="flex gap-6">
                    {/* アバター */}
                    <div className="h-24 w-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl font-bold shrink-0">
                      {data.avatarUrl ? (
                        <img
                          src={data.avatarUrl}
                          alt={data.username}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        initial
                      )}
                    </div>

                    {/* ユーザー情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold">{data.username}</h1>
                        <Badge className="rounded-full bg-emerald-500 text-white">
                          {data.currentRank.name}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mt-1">@{data.username}</p>

                      {/* ポイント */}
                      <div className="flex items-center gap-2 mt-3">
                        <Zap className="h-5 w-5 text-emerald-500" />
                        <span className="text-3xl font-bold">{data.points}</span>
                        <span className="text-xl text-muted-foreground">pt</span>
                      </div>

                      {/* 次のランクまでの進捗 */}
                      {data.nextRank && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Trophy className="h-4 w-4" />
                            <span>
                              次のランク: {data.nextRank.icon} {data.nextRank.name}
                            </span>
                            <span className="ml-auto">
                              {data.points} / {data.nextRank.minPoints}
                            </span>
                          </div>

                          <div className="mt-2 h-3 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-orange-400"
                              style={{ width: `${data.progressToNextRank}%` }}
                            />
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            あと{pointsToNext}ptで「{data.nextRank.name}」に昇格!
                          </p>
                        </div>
                      )}

                      {!data.nextRank && (
                        <p className="mt-4 text-sm text-emerald-600 font-medium">
                          最高ランクに達しています!
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* 統計カード */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold">{data.questionCount}</div>
                    <div className="text-sm text-muted-foreground mt-1">質問 (+5pt)</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold">{data.answerCount}</div>
                    <div className="text-sm text-muted-foreground mt-1">回答 (+10pt)</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold">{data.bestAnswerCount}</div>
                    <div className="text-sm text-muted-foreground mt-1">ベストアンサー (+50pt)</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold">{data.likeReceivedCount}</div>
                    <div className="text-sm text-muted-foreground mt-1">共感された (+2pt)</div>
                  </Card>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
