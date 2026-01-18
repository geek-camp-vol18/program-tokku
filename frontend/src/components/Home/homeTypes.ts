import type { Question } from "@/types/question";

/** 画面上のフィルタ状態 */
export type Filter = "all" | "open" | "solved";

/**
 * 質問一覧表示に必要な “画面用” の形
 * - DBの Question を基底にして、一覧表示に必要な情報を足す
 * - モックでもDBでもこの形に揃える（後で差分が出ない）
 */
export type QuestionListItem = Question & {
  answer_count: number;
  like_count: number;
  tags: string[];
  author: {
    id: string;
    username: string;
    avatar_url: string | null;
    rank_name?: string; // ranks.name
  };
};
