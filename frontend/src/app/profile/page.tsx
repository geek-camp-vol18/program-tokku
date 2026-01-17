"use client";

import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { PointHistory } from "@/components/profile/PointHistory";
import { SkillTags } from "@/components/profile/SkillTags";
import { BadgeList } from "@/components/profile/BadgeList";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />

        <main className="w-full flex-1 px-2 py-8 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3">
              <ProfileOverview />
            </div>
          </div>

          {/* 下段：ポイント履歴と得意タグ（必要に応じてコメントアウト） */}
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