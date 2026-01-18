"use client";

import type { QuestionListItem } from "@/components/Home/homeTypes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { LikeButton } from "@/components/common/LikeButton";

function makeExcerpt(content: string, maxLen = 90): string {
  const oneLine = (content ?? "").replace(/\s+/g, " ").trim();
  if (!oneLine) return "";
  return oneLine.length > maxLen ? oneLine.slice(0, maxLen) + "…" : oneLine;
}

function formatRelativeTime(iso: string): string {
  // UTCとして解釈するために、末尾にZがなければ追加
  const utcIso = iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z";
  const d = new Date(utcIso);
  const ms = d.getTime();
  if (Number.isNaN(ms)) return "";

  const diffSec = Math.floor((Date.now() - ms) / 1000);
  if (diffSec < 60) return "たった今";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}日前`;
}

function statusText(status: QuestionListItem["status"]) {
  return status === "open" ? "回答募集中" : "解決済み";
}

// ステータスに合わせた色
function toneClass(status: QuestionListItem["status"]) {
  return status === "open"
    ? {
        badge: "bg-amber-50 text-amber-700 border border-amber-200",
        box: "bg-amber-50 border border-amber-200",
        num: "text-amber-700",
      }
    : {
        badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        box: "bg-emerald-50 border border-emerald-200",
        num: "text-emerald-700",
      };
}

type Props = {
  question: QuestionListItem;
};

// 質問一覧のカードコンポーネント
export function QuestionCard({ question }: Props) {
  const router = useRouter();

  const excerpt = makeExcerpt(question.content);
  const timeLabel = formatRelativeTime(question.created_at);

  const authorInitial = question.author.username.trim().charAt(0) || "?";
  const handle = `@${question.author.username || "unknown"}`;
  const rankName = question.author.rank_name;

  const tone = toneClass(question.status);

  const goDetail = () => {
    // 後で詳細ページ遷移
    router.push(`/questions/${question.id}`);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") goDetail();
      }}
      className={[
        "p-5",
        // hoverで押せる感
        "cursor-pointer transition",
        "hover:shadow-sm hover:bg-muted/30",
        // フォーカス時も分かるように
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        // クリック中
        "active:scale-[0.99]",
      ].join(" ")}
    >
      <div className="flex gap-4">
        {/* 左：回答数 */}
        <div
          className={[
            "flex w-16 shrink-0 flex-col items-center justify-center rounded-xl px-2 py-3",
            tone.box,
          ].join(" ")}
        >
          <div
            className={[
              "text-2xl font-bold leading-none tabular-nums",
              tone.num,
            ].join(" ")}
          >
            {question.answer_count}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">回答</div>
        </div>

        {/* 右：本文エリア */}
        <div className="min-w-0 flex-1">
          {/* 上段：ステータスバッジ */}
          <div className="flex items-center justify-between gap-3">
            <Badge
              variant="outline"
              className={["rounded-full", tone.badge].join(" ")}
            >
              {statusText(question.status)}
            </Badge>
          </div>

          {/* タイトル */}
          <h3 className="mt-2 truncate text-lg font-semibold">
            {question.title}
          </h3>

          {/* 抜粋 */}
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {excerpt}
          </p>

          {/* タグ */}
          <div className="mt-3 flex flex-wrap gap-2">
            {question.tags.slice(0, 3).map((t) => (
            <Badge key={t} className="rounded-full bg-orange-50 text-orange-700 text-xs font-normal border border-orange-200"
             >
              {t}
            </Badge>
            ))}
          </div>

          {/* 下段：ユーザー情報 */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                {authorInitial}
              </div>

              <div className="min-w-0 flex items-center gap-2">
                <span className="truncate text-sm text-muted-foreground">
                  {handle}
                </span>

                {rankName ? (
                  <Badge variant="secondary" className="h-5 rounded-full text-xs">
                    {rankName}
                  </Badge>
                ) : null}

                {timeLabel ? (
                  <span className="text-xs text-muted-foreground">
                    ・{timeLabel}
                  </span>
                ) : null}
              </div>
            </div>

            {/* いいね */}
            <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <LikeButton questionId={question.id} initialLikeCount={question.like_count} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
