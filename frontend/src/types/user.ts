// ユーザー関連の型定義

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  points: number;
  rank_id: number | null;
  solved_count: number;
  answer_count: number;
  created_at: string;
}

export interface Rank {
  id: number;
  name: string;
  min_points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  earned_at: string;
}
