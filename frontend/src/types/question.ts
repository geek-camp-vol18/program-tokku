// 質問関連の型定義

export interface Question {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  status: "open" | "closed";
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface QuestionTag {
  id: string;
  question_id: string;
  tag_id: string;
}

export interface Like {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}
