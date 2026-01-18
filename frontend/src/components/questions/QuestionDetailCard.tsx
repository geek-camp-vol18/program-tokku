"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

import { LikeButton } from "@/components/common/LikeButton";
import { MarkdownPreview } from "@/components/questions/MarkdownPreview";
import type { Question } from "@/types/question";

type Props = {
  question: Question;
  tags: string[];
  answerCount: number;
  likeCount: number;
  asker: {
    username: string;
    rankName?: string | null;
  };
};

function statusText(status: Question["status"]) {
  return status === "open" ? "回答募集中" : "解決済み";
}

function statusBadgeClass(status: Question["status"]) {
  return status === "open"
    ? "bg-amber-50 text-amber-700 border border-amber-200"
    : "bg-emerald-50 text-emerald-700 border border-emerald-200";
}

function formatJPDateTime(iso: string) {
  // UTCとして解釈するために、末尾にZがなければ追加
  const utcIso = iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z";
  const d = new Date(utcIso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const hh = d.getHours();
  const mi = d.getMinutes().toString().padStart(2, "0");
  return `${yyyy}年${mm}月${dd}日 ${hh}:${mi}`;
}

export function QuestionDetailCard({ question, tags, answerCount, likeCount, asker }: Props) {
  const name = (asker.username ?? "名無し").trim() || "名無し";
  const initial = name.charAt(0) || "?";

  return (
    <Card className="p-6">
      {/* ステータスバッジ・カテゴリバッジ */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={["rounded-full", statusBadgeClass(question.status)].join(" ")}
        >
          {statusText(question.status)}
        </Badge>
        {question.category && (
          <Badge
            variant="outline"
            className="rounded-full bg-blue-50 text-blue-700 border border-blue-200"
          >
            {question.category}
          </Badge>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{question.title}</h1>

      {/* 回答数と投稿日 */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span className="tabular-nums">{answerCount}</span>
          <span>件の回答</span>
        </div>
        <div>{formatJPDateTime(question.created_at)}</div>
      </div>

      <div className="mt-5 rounded-xl bg-muted/50 p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
          {initial}
        </div>

        {/* 質問者情報 */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-sm font-medium">@{name}</span>
            {asker.rankName ? (
              <Badge className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                {asker.rankName}
              </Badge>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">質問者</div>
        </div>
      </div>

      <div className="mt-5">
        <MarkdownPreview content={question.content} />
      </div>

      {/* タグ一覧 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((t) => (
            <Badge
              key={t}
              className="rounded-full bg-stone-100 text-stone-600 text-xs font-normal border border-stone-200"
            >
              {t}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">タグなし</span>
        )}
      </div>

      {/* いいね・回答数 */}
      <div className="mt-5 flex items-center gap-4 text-sm">
        <LikeButton questionId={question.id} initialLikeCount={likeCount} />
        <div className="flex items-center gap-1 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span className="tabular-nums">{answerCount}</span>
        </div>
      </div>
    </Card>
  );
}
