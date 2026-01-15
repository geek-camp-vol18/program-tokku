"use client";

import { Heart, CheckCircle2, Clock3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Question } from "./types";

type Props = {
  question: Question;
};

export function QuestionCard({ question }: Props) {
  const {
    title,
    excerpt,
    status,
    tags,
    answerCount,
    likeCount,
    authorName,
    authorInitial,
    authorBadge,
    createdAtLabel,
  } = question;

  const isOpen = status === "open";

  const tone = isOpen
    ? {
        // 回答募集中
        box: "bg-amber-50 text-amber-700 border-amber-200",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
      }
    : {
        // 解決済み
        box: "bg-primary/10 text-primary border-primary/30",
        badge: "bg-primary/10 text-primary border-primary/30",
      };

  return (
    <Card className="border border-border bg-card transition hover:bg-muted/30">
      <CardContent className="flex gap-4 p-4">
        {/* 左：回答数 */}
        <div className="w-16 shrink-0">
          <div className={`rounded-lg border px-2 py-2 text-center ${tone.box}`}>
            <div className="text-lg font-semibold leading-none">{answerCount}</div>
            <div className="mt-1 text-xs">回答</div>
          </div>
        </div>

        {/* 右：本文 */}
        <div className="flex-1 space-y-2">
          {/* ステータス */}
          <Badge variant="outline" className={`w-fit ${tone.badge}`}>
            {isOpen ? (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                回答募集中
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                解決済み
              </span>
            )}
          </Badge>

          {/* タイトル */}
          <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
            {title}
          </h3>

          {/* 本文抜粋 */}
          <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>

          {/* タグ */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200 font-normal">
                           
                {tag}
              </Badge>
             ))}
          </div>


          {/* フッター */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {authorInitial ?? authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span>@{authorName}</span>

              {authorBadge && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  {authorBadge}
                </Badge>
              )}

              <span>・</span>
              <span>{createdAtLabel}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="text-sm">{likeCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
