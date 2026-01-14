import { Heart, CheckCircle2, Clock3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Question } from "./types"

type Props = {
  question: Question
}

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
  } = question

  const isOpen = status === "open"

  return (
    <Card className="transition hover:bg-muted/30">
      <CardContent className="p-4 flex gap-4">
        {/* 左：回答数（添付イメージ寄せ） */}
        <div className="w-16 shrink-0">
          <div className="rounded-lg bg-amber-50 text-amber-700 border border-amber-100 px-2 py-2 text-center">
            <div className="text-lg font-semibold leading-none">{answerCount}</div>
            <div className="text-xs mt-1">回答</div>
          </div>
        </div>

        {/* 右：本文 */}
        <div className="flex-1 space-y-2">
          {/* ステータス */}
          <Badge
            variant="outline"
            className={
              isOpen
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }
          >
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
          <h3 className="font-semibold leading-snug line-clamp-2">{title}</h3>

          {/* 本文抜粋 */}
          <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>

          {/* タグ */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
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
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {authorBadge}
                </Badge>
              )}

              <span className="text-muted-foreground">・</span>
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
  )
}
