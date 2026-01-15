// frontend/src/components/questions/types.ts

export type QuestionStatus = "open" | "resolved"

export type Question = {
  id: string
  title: string
  excerpt: string
  status: QuestionStatus
  tags: string[]
  answerCount: number
  likeCount: number

  authorName: string
  authorInitial?: string
  authorBadge?: string // 例: "初心者"（任意）

  createdAtLabel: string // 例: "5分前"
}
