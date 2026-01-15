// 回答関連の型定義

export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  is_best_answer: boolean;
  created_at: string;
}
