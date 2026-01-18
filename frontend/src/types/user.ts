// ユーザー関連の型定義

// ユーザープロフィール（profilesテーブル）
export interface Profile {
  id: string;              // ユーザーID（auth.users.idと同じ）
  username: string;        // ユーザー名
  avatar_url: string | null; // アバター画像URL
  bio: string | null;      // 自己紹介
  points: number;          // 保有ポイント
  rank_id: number | null;  // ランクID
  solved_count: number;    // 解決した質問数
  answer_count: number;    // 回答数
  created_at: string;      // 作成日時
}

// ランク（ranksテーブル）
export interface Rank {
  id: number;        // ランクID
  name: string;      // ランク名（ビギナー、デベロッパー等）
  min_points: number; // 必要最低ポイント
}

// バッジ（badgesテーブル）
export interface Badge {
  id: string;
  name: string;              // バッジ名
  description: string | null; // 説明
  icon_url: string | null;   // アイコンURL
}

// ユーザーとバッジの中間テーブル（user_badgesテーブル）
export interface UserBadge {
  user_id: string;  // ユーザーID
  badge_id: string; // バッジID
  earned_at: string; // 獲得日時
}
