"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        
        // セッション確認
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error("認証エラー:", authError);
          router.replace("/login");
          return;
        }
        
        if (!user) {
          console.error("ログインユーザーが見つかりません");
          router.replace("/login");
          return;
        }

        // 基本情報を取得
        const [profileResponse, statsResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          fetch(`/api/profile/stats?userId=${user.id}`)
        ]);

        const { data: baseData, error: profileError } = profileResponse;

        if (profileError) {
          console.error("プロフィール取得エラー:", profileError);
          setError("プロフィールの取得に失敗しました");
          setLoading(false);
          return;
        }

        if (!baseData) {
          setError("プロフィールが見つかりません");
          setLoading(false);
          return;
        }

        // APIからの詳細データを取得
        let detailData = null;
        if (statsResponse.ok) {
          detailData = await statsResponse.json();
        }

        setProfile({
          ...baseData,
          ...detailData,
          badgeData: detailData?.badges || []
        });
        setLoading(false);

      } catch (err) {
        console.error("エラーが発生しました:", err);
        setError("予期しないエラーが発生しました");
        setLoading(false);
      }
    }

    loadProfileData();
  }, [router]);

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
            ) : error ? (
              <div className="p-10 text-center text-red-600">{error}</div>
            ) : profile ? (
              <ProfileOverview data={profile} />
            ) : (
              <div className="p-10 text-center">
                プロフィールが見つかりません
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}