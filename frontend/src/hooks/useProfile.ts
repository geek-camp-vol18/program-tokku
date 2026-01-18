"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ランク定義
const RANKS = [
  { name: "ビギナー", minPoints: 0, icon: "🌱" },
  { name: "デベロッパー", minPoints: 500, icon: "💻" },
  { name: "ウィザード", minPoints: 1000, icon: "🧙" },
];

export interface ProfileData {
  // 基本情報
  id: string;
  username: string;
  avatarUrl: string | null;
  points: number;

  // ランク情報
  currentRank: { name: string; icon: string };
  nextRank: { name: string; icon: string; minPoints: number } | null;
  progressToNextRank: number; // 0-100

  // 統計
  questionCount: number;
  answerCount: number;
  bestAnswerCount: number;
  likeReceivedCount: number;

  // バッジ
  badges: {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    earnedAt: string;
  }[];
}

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

  // 進捗計算
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

export function useProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // 現在のユーザーを取得
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setError("ログインが必要です");
          setLoading(false);
          return;
        }

        const userId = userData.user.id;

        // プロフィール情報を取得
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          throw new Error("プロフィールの取得に失敗しました");
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

        // 共感された数（自分の質問への「いいね」数）を取得
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

        // バッジを取得
        const { data: userBadges } = await supabase
          .from("user_badges")
          .select(
            `
            earned_at,
            badges (
              id,
              name,
              description,
              icon_url
            )
          `
          )
          .eq("user_id", userId);

        const badges =
          userBadges?.map((ub: any) => ({
            id: ub.badges.id,
            name: ub.badges.name,
            description: ub.badges.description,
            iconUrl: ub.badges.icon_url,
            earnedAt: ub.earned_at,
          })) || [];

        // ランク情報を計算
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
          badges,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { data, loading, error };
}
