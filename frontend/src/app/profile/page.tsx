import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { PointHistory } from "@/components/profile/PointHistory";
import { SkillTags } from "@/components/profile/SkillTags";
import { BadgeList } from "@/components/profile/BadgeList";

import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-6xl mx-auto flex gap-6 py-8">
        {/* 左サイドバー */}
        <aside className="w-56 space-y-6">
            <nav className="space-y-2 text-sm">
                <p className="font-semibold text-xs text-muted-foreground px-3">
                メニュー
                </p>

                <Link
                href="/profile"
                className="block w-full text-left px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                マイページ
                </Link>

                <Link
                href="/"
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-foreground">
                ホーム
                </Link>

                <Link
                href="/categories"
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-foreground">
                カテゴリ
                </Link>
            </nav>

            <div className="space-y-2 text-sm text-muted-foreground px-3">
                <p className="font-semibold text-[12px] text-foreground">ポイントの貯め方</p>
                <p>質問投稿 <span className="text-primary font-semibold">+5pt</span></p>
                <p>回答投稿 <span className="text-primary font-semibold">+10pt</span></p>
                <p>ベストアンサー <span className="text-primary font-semibold">+50pt</span></p>
                <p>共感をもらう <span className="text-primary font-semibold">+2pt</span></p>
            </div>
        </aside>

        {/* 右メインコンテンツ */}
        <main className="flex-1 space-y-6">
          <ProfileOverview />

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <PointHistory />
            </div>
            <div className="space-y-6">
              <SkillTags />
              <BadgeList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}