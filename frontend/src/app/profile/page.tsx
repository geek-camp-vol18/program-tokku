"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { useProfile } from "@/hooks/useProfile";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { StatsCard } from "@/components/profile/StatsCard";
import { BadgeCard } from "@/components/profile/BadgeCard";

export default function ProfilePage() {
  const router = useRouter();
  const { data, loading, error } = useProfile();

  useEffect(() => {
    if (!loading && error === "ログインが必要です") {
      router.push("/login");
    }
  }, [loading, error, router]);

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
                {/* メインカード: プロフィール + バッジ */}
                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                  <ProfileCard profile={data} />
                  <BadgeCard badges={data.badges} />
                </div>

                {/* 統計カード */}
                <StatsCard
                  questionCount={data.questionCount}
                  answerCount={data.answerCount}
                  bestAnswerCount={data.bestAnswerCount}
                  likeReceivedCount={data.likeReceivedCount}
                />
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
