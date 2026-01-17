"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Award } from "lucide-react";

// 統計データの設定
const stats = [
  { label: "質問", value: 8, sub: "+5pt" },
  { label: "回答", value: 25, sub: "+10pt" },
  { label: "ベストアンサー", value: 12, sub: "+50pt" },
  { label: "共感された", value: 35, sub: "+2pt" },
];

// バッジデータの設定
const badges = [
  { name: "環境構築職人", acquired: false },
  { name: "今週のヒーロー", acquired: false },
  { name: "初めての解決", acquired: false },
  { name: "いいね100", acquired: false },
];

export function ProfileOverview() {
  const currentPoint = 470;
  const nextRankPoint = 500;
  const progress = (currentPoint / nextRankPoint) * 100;

  return (
    <Card className="max-w-6xl mx-auto border-none shadow-sm bg-white">
      <CardContent className="p-8">
        
        {/* 上段：左右分割レイアウト */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 左側：ユーザー基本情報とプログレスバー */}
          <div className="flex-1 space-y-12">
            {/* ユーザー情報セクション */}
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 bg-[#E6F4F1] text-[#2D9E8B]">
                <AvatarFallback className="text-4xl">Y</AvatarFallback>
              </Avatar>

              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-4xl font-bold text-slate-800">山田太郎</h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#E6F4F1] text-[#2D9E8B] font-bold">
                    ビギナー
                  </span>
                </div>
                <p className="text-base text-slate-400 mb-6">@yamada</p>
                
                <div className="flex items-baseline gap-2">
                  <div className="flex items-center">
                    <span className="text-orange-400 text-4xl mr-3">⚡</span>
                    <span className="text-3xl font-bold text-slate-900 tracking-tighter">
                      {currentPoint}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-slate-400 ml-1">
                    pt
                  </span>
                </div>
              </div>
            </div>

            {/* プログレスバーセクション */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Award className="h-4 w-4 text-[#2D9E8B]" /> 
                    <span className="text-sm font-medium">次のランク：</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">💻 デベロッパー</span>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {currentPoint} / {nextRankPoint} pt
                </span>
              </div>
              <Progress value={progress} className="h-2.5 bg-slate-100" />
              <p className="text-xs text-slate-400">
                あと <span className="font-bold">{nextRankPoint - currentPoint}pt</span> で「デベロッパー」に昇格！
              </p>
            </div>
          </div>

          {/* 右側：獲得バッジ */}
          <div className="w-full md:w-72 border border-slate-100 rounded-2xl p-6 py-8 bg-slate-50/30">
            <h3 className="text-sm font-bold text-slate-700 mb-6">獲得バッジ</h3>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div key={badge.name} className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-xl bg-slate-100/50 border border-slate-100 transition-colors" />
                  <p className="text-[10px] text-center text-slate-400 font-medium leading-tight">
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 下段：4つの統計メトリクス */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 mt-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-slate-50 px-6 py-5 text-center transition-all bg-white hover:bg-[#E6F4F1] hover:shadow-md cursor-pointer"
            >
              <p className="text-xs font-bold text-slate-400 mb-2 group-hover:text-[#2D9E8B] transition-colors">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-slate-700 group-hover:text-[#2D9E8B] transition-colors">
                {stat.value}
              </p>
              <p className="text-xs text-[#2D9E8B] font-bold mt-1.5">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}