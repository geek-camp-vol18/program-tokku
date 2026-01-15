// 回答関連の型定義

// 回答（answersテーブル）
export interface Answer {
  id: string;
  question_id: string;    // 質問ID
  user_id: string;        // 回答者ID
  content: string;        // 回答内容
  is_best_answer: boolean; // ベストアンサーフラグ
  created_at: string;     // 投稿日時
}
