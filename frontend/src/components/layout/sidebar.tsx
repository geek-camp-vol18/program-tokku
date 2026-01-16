"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  User,
  Star,
  Zap,
  Trophy,
  Target,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const mainNavItems = [
  { href: "/", icon: Home, label: "ホーム" },
  { href: "/categories", icon: FolderOpen, label: "カテゴリ" },
  { href: "/profile", icon: User, label: "マイページ" },
];

const pointRules = [
  { action: "質問投稿", points: 5, icon: "❓" },
  { action: "回答投稿", points: 10, icon: "💬" },
  { action: "ベストアンサー", points: 50, icon: "🏆" },
  { action: "共感をもらう", points: 2, icon: "❤️" },
];

const ranks = [
  { name: "ビギナー", points: 0, icon: "🌱" },
  { name: "デベロッパー", points: 500, icon: "💻" },
  { name: "ウィザード", points: 1000, icon: "🧙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r bg-white h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* メインナビゲーション */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 区切り線 */}
        <div className="border-t" />

        {/* ポイント獲得ルール */}
        <div>
          <h3 className="flex items-center gap-2 px-3 mb-3 text-sm font-semibold text-foreground">
            <Zap className="h-4 w-4 text-amber-500" />
            ポイントの貯め方
          </h3>
          <div className="space-y-2">
            {pointRules.map((rule) => (
              <div
                key={rule.action}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50"
              >
                <span className="flex items-center gap-2 text-sm">
                  <span>{rule.icon}</span>
                  {rule.action}
                </span>
                <span className="text-sm font-bold text-primary">
                  +{rule.points}pt
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t" />

        {/* ランク一覧 */}
        <div>
          <h3 className="flex items-center gap-2 px-3 mb-3 text-sm font-semibold text-foreground">
            <Trophy className="h-4 w-4 text-amber-500" />
            ランク一覧
          </h3>
          <div className="space-y-2">
            {ranks.map((rank) => (
              <div
                key={rank.name}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{rank.icon}</span>
                  {rank.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {rank.points}pt〜
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t" />

        {/* バッジ例 */}
        <div>
          <h3 className="flex items-center gap-2 px-3 mb-3 text-sm font-semibold text-foreground">
            <Star className="h-4 w-4 text-amber-500" />
            獲得できるバッジ
          </h3>
          <div className="space-y-2 px-3">
            <div className="flex items-start gap-2 text-sm">
              <span className="text-lg">🔧</span>
              <div>
                <p className="font-medium">環境構築職人</p>
                <p className="text-xs text-muted-foreground">環境構築タグで10件解決</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-lg">🦸</span>
              <div>
                <p className="font-medium">今週のヒーロー</p>
                <p className="text-xs text-muted-foreground">1週間で5件以上解決</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
