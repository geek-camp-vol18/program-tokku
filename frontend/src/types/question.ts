// 質問関連の型定義

// 質問（questionsテーブル）
export interface Question {
  id: string;
  user_id: string;           // 投稿者ID
  title: string;             // タイトル
  content: string;           // 内容
  image_url: string | null;  // 添付画像URL
  status: "open" | "closed"; // open=募集中, closed=解決済み
  category: string | null;   // カテゴリ（バグ、環境構築等）
  created_at: string;        // 投稿日時
}

// タグ（tagsテーブル）
export interface Tag {
  id: string;
  name: string; // タグ名（Python, React等）
}

// 質問とタグの中間テーブル（question_tagsテーブル）
export interface QuestionTag {
  id: string;
  question_id: string;
  tag_id: string;
}

// いいね（likesテーブル）
export interface Like {
  id: string;
  user_id: string;     // いいねしたユーザーID
  question_id: string; // いいねされた質問ID
  created_at: string;
}
