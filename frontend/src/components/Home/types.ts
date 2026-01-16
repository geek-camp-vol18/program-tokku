export type QuestionStatus = "open" | "resolved"

/**
 * Supabaseから取得する「質問（一覧用）」の形
 * - profiles / tagsは join でネストして入ってくる想定
 * - answer_count / like_count は questions に持たせる前提（推奨）
 */
export type QuestionRow = {
  id: string
  title: string
  content: string
  status: QuestionStatus
  created_at: string

  // 集計済み（questionsにカラム追加する想定）
  answer_count: number
  like_count: number

  // 投稿者（profiles join）
  profiles: {
    id: string
    username: string | null
    avatar_url: string | null
  } | null

  // タグ（question_tags -> tags join）
  question_tags: Array<{
    tags: { name: string } | null
  }> | null
}

/**
 * QuestionCardに渡す「表示用モデル」
 * - excerpt / createdAtLabel などUIのための整形済み値
 */
export type QuestionCardModel = {
  id: string
  title: string
  excerpt: string
  status: QuestionStatus
  tags: string[]
  answerCount: number
  likeCount: number

  authorName: string
  authorInitial?: string
  authorBadge?: string

  createdAtLabel: string
}

/**
 * 一覧取得結果（QuestionRow）→ カード表示（QuestionCardModel）へ変換
 * ※ createdAtLabel は一旦簡易でOK（後で "5分前" に置換可）
 */
export function toQuestionCardModel(row: QuestionRow): QuestionCardModel {
  const authorName = row.profiles?.username ?? "名無し"
  const authorInitial = authorName.trim().charAt(0) || "?"

  const tags =
    row.question_tags
      ?.map((qt) => qt.tags?.name)
      .filter((t): t is string => !!t) ?? []

  const excerpt = makeExcerpt(row.content)

  return {
    id: row.id,
    title: row.title,
    excerpt,
    status: row.status,
    tags,
    answerCount: row.answer_count ?? 0,
    likeCount: row.like_count ?? 0,
    authorName,
    authorInitial,
    createdAtLabel: formatCreatedAtLabel(row.created_at),
  }
}

function makeExcerpt(content: string, maxLen = 90): string {
  const oneLine = (content ?? "").replace(/\s+/g, " ").trim()
  if (!oneLine) return ""
  return oneLine.length > maxLen ? oneLine.slice(0, maxLen) + "…" : oneLine
}

function formatCreatedAtLabel(createdAtIso: string): string {
  // とりあえずは簡易表示。後で "5分前" に改善すればOK
  // createdAtIso が壊れてても落ちないようにする
  const d = new Date(createdAtIso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("ja-JP")
}
