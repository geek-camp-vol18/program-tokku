"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { PointHistory } from "@/components/profile/PointHistory";
import { SkillTags } from "@/components/profile/SkillTags";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        // 1. セッション確認
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("ログインユーザーが見つかりません");
          setLoading(false);
          return;
        }

        // 2. 基本情報をSupabaseから並列で取得
        const [profileResponse, statsResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          fetch(`/api/profile/stats?userId=${user.id}`)
        ]);

        const { data: baseData } = profileResponse;

        if (!baseData) {
          setLoading(false);
          return;
        }

        // 3. APIからの詳細データを取得
        let detailData = null;
        if (statsResponse.ok) {
          detailData = await statsResponse.json();
          console.log('API Response:', detailData);
        } else {
          console.error('API Error:', statsResponse.status, await statsResponse.text());
        }

        // 4. 一度だけマージしてsetProfile
        setProfile({
          ...baseData,
          ...detailData,
          badgeData: detailData?.badges || []
        });
        setLoading(false);

      } catch (err) {
        console.error("エラーが発生しました:", err);
        setLoading(false);
      }
    }

    loadProfileData();
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="flex w-full">
        <aside className="shrink-0 border-r bg-white min-h-[calc(100vh-64px)]">
          <Sidebar />
        </aside>

        <main className="w-full flex-1 px-6 py-8 space-y-6">
          <div className="w-full">
            {loading ? (
              <div className="p-10 text-center">読み込み中...</div>
            ) : profile ? (
              <ProfileOverview data={profile} />
            ) : (
              <div className="p-10 text-center">
                プロフィールが見つかりません。ログインし直してください。
              </div>
            )}
          </div>
          {/* 下段：ポイント履歴と得意タグ（必要に応じて） */}
          {/* <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <PointHistory />
            </div>
            <div className="space-y-6">
              <SkillTags />
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}
