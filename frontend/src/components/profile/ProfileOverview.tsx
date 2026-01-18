"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Award } from "lucide-react";
interface ProfileData {
  id: string;
  username: string;
  avatar_url:string;
  bio:string;
  points:number;
  rank_id:string;
  question_count:number;
  answered_count:number;
  solved_count:number;  
  liked_count:number;
  created_at:string;
  badgeData?: any[]; 
  tag_stats?: { name: string; count: number }[];
}

export function ProfileOverview({ data }: { data: ProfileData | null }) {
  // データが届くまでの表示
  if (!data) return <div className="p-10 text-center">読み込み中...</div>;

  const currentPoint = data.points || 0;

  // ランク管理ロジック
  const getRankInfo = (points: number) => {
    if (points < 100) {
      return {
        rank: 'none',
        rankName: 'ひよっこ',
        icon: '🔰',
        minPoint: 0,
        maxPoint: 99,
        nextRank: 'ビギナー',
        nextRankPoint: 100
      };
    } else if (points < 500) {
      return {
        rank: 'beginner',
        rankName: 'ビギナー',
        icon: '🌱',
        minPoint: 100,
        maxPoint: 499,
        nextRank: 'ディベロッパー',
        nextRankPoint: 500
      };
    } else if (points < 1000) {
      return {
        rank: 'developer',
        rankName: 'ディベロッパー',
        icon: '💻',
        minPoint: 500,
        maxPoint: 999,
        nextRank: 'ウィザード',
        nextRankPoint: 1000
      };
    } else {
      return {
        rank: 'wizard',
        rankName: 'ウィザード',
        icon: '🧙',
        minPoint: 1000,
        maxPoint: Infinity,
        nextRank: null,
        nextRankPoint: null
      };
    }
  };

  const rankInfo = getRankInfo(currentPoint);
  
  // 次のランク情報も取得（アイコン用）
  const nextRankInfo = rankInfo.nextRankPoint !== null 
    ? getRankInfo(rankInfo.nextRankPoint) 
    : null;
  
  // プログレスバーの計算
  let progress: number;
  if (rankInfo.nextRankPoint === null) {
    // ウィザードの場合は100%
    progress = 100;
  } else {
    const pointsInRange = currentPoint - rankInfo.minPoint;
    const rangeSize = rankInfo.nextRankPoint - rankInfo.minPoint;
    progress = (pointsInRange / rangeSize) * 100;
  }

  const pointsUntilNextRank = rankInfo.nextRankPoint !== null 
    ? rankInfo.nextRankPoint - currentPoint 
    : 0;

  // 統計データの設定
const stats = [
  { label: "質問", value: data.question_count, sub: "+5pt" },
  { label: "回答", value: data.answered_count, sub: "+10pt" },
  { label: "ベストアンサー", value: data.solved_count, sub: "+50pt" },
  { label: "共感された", value: data.liked_count, sub: "+2pt" },
];

// バッジデータの設定
const displayBadges = data?.badgeData || [
  { name: "環境構築職人", acquired: false },
  { name: "今週のヒーロー", acquired: false },
  { name: "初めての解決", acquired: false },
  { name: "いいね100", acquired: false },
];

const displayTags = data?.tag_stats || [];


  return (
    <Card className="max-w-6xl mx-auto border-none shadow-sm bg-white">
    {/*<Card className="w-full border-none shadow-sm bg-white overflow-hidden"> */}
      <CardContent className="p-8">
        
        {/* 上段：左右分割レイアウト */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 左側：ユーザー基本情報とプログレスバー */}
            <div className="flex-1 space-y-6">
            {/* ユーザー情報セクション */}
            <div className="flex items-start gap-6">
              {/* ProfileOverview.tsx */}
              <Avatar className="h-24 w-24 bg-[#E6F4F1] text-[#2D9E8B]">
                {/* data.avatar_url が「空文字」や「undefined」でない場合のみ img を出す */}
                {data?.avatar_url && data.avatar_url !== "" ? (
                  <img src={data.avatar_url} alt={data.username} onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <AvatarFallback className="text-4xl">
                    {data?.username ? data.username[0] : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-4xl font-bold text-slate-800">{data.username}</h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#E6F4F1] text-[#2D9E8B] font-bold">
                    {rankInfo.icon} {rankInfo.rankName}
                  </span>
                </div>
                <p className="text-base text-slate-400 mb-2">@{data.id}</p>
                {data?.bio && (
                  <p className="text-base text-slate-600 mb-3">{data.bio}</p>
                )}
                
                
                {data?.created_at && (
                  <p className="text-xs text-slate-400 mb-3">
                    {(() => {
                      const date = new Date(data.created_at);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      return `${year}年${month}月から利用しています`;
                    })()}
                  </p>
                )}
                <div className="flex items-baseline gap-2 mt-2">
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
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Award className="h-4 w-4 text-[#2D9E8B]" /> 
                  <span className="text-sm font-medium">
                    {rankInfo.nextRank ? `次のランク：${nextRankInfo?.icon} ${rankInfo.nextRank}` : '最高ランク達成！'}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {rankInfo.nextRankPoint !== null 
                    ? `${currentPoint} / ${rankInfo.nextRankPoint} pt`
                    : `${currentPoint} pt`
                  }
                </span>
              </div>
              <Progress value={progress} className="h-2.5 bg-slate-100" />
              {rankInfo.nextRankPoint !== null ? (
                <p className="text-xs text-slate-400">
                  あと <span className="font-bold">{pointsUntilNextRank}pt</span> で「{rankInfo.nextRank}」に昇格！
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  <span className="font-bold">🎉 ウィザードランクに達成しました！</span>
                </p>
              )}
            </div>
          </div>

          {/* 右側：獲得バッジ */}
          <div className="w-full md:w-72 border border-slate-100 rounded-2xl p-6 py-8 bg-slate-50/30">
            <h3 className="text-sm font-bold text-slate-700 mb-6">獲得バッジ</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* バッジのループ表示部分 */}
                {displayBadges.map((badge) => (
                  <div 
                    key={badge.name} 
                    className={badge.acquired ? "text-primary" : "text-muted-foreground opacity-50"}
                  >
                    {badge.name}
                  </div>
              ))}
            </div>
          </div>
        </div>
        {/* 
         右側：得意タグセクション 
        <div className="border border-slate-100 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-6">得意タグ</h3>
          <div className="space-y-4">
            {displayTags.length > 0 ? (
              displayTags.slice(0, 5).map((tag: any) => ( // 上位5つを表示
                <div key={tag.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">{tag.name}</span>
                    {tag === displayTags[0] && <span className="text-xs">🔥</span>}
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    {tag.count} 問解決
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">まだ解決した質問はありません</p>
            )}
          </div>
        </div>
        */}

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