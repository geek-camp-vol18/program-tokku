"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

import type { Answer } from "@/types/answer";
import { MarkdownPreview } from "@/components/questions/MarkdownPreview";

export type ProfileJoined = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  ranks?: { name: string | null } | null;
};

export type AnswerRow = Answer & {
  profiles: ProfileJoined | null;
};

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
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

type Props = {
  answer: AnswerRow;
  showBestAnswerButton?: boolean;
  onSelectBestAnswer?: () => void;
};

export function AnswerCard({ answer, showBestAnswerButton, onSelectBestAnswer }: Props) {
  const name = (answer.profiles?.username ?? "名無し").trim() || "名無し";
  const handle = `@${name}`;
  const initial = name.charAt(0) || "?";
  const rankName = answer.profiles?.ranks?.name ?? null;
  const time = formatRelativeTime(answer.created_at);

  return (
    <Card className={`p-5 space-y-3 ${answer.is_best_answer ? "border-2 border-emerald-400 bg-emerald-50/30" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {initial}
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

            {time ? (
              <span className="text-xs text-muted-foreground">・{time}</span>
            ) : null}
          </div>
        </div>

        {/* ベストアンサー表示 */}
        {answer.is_best_answer ? (
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 gap-1">
            <Award className="h-3 w-3" />
            ベストアンサー
          </Badge>
        ) : null}
      </div>

      <div className="text-sm">
        <MarkdownPreview content={answer.content} />
      </div>

      {/* ベストアンサー選択ボタン */}
      {showBestAnswerButton && onSelectBestAnswer && (
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectBestAnswer}
            className="gap-1 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
          >
            <Award className="h-4 w-4" />
            ベストアンサーに選ぶ
          </Button>
        </div>
      )}
    </Card>
  );
}
