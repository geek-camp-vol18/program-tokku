import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 相対時間を日本語で返す
 *
 * 現在時刻と指定された日時の差を計算し、
 * 「〇分前」「〇時間前」のような人間が読みやすい形式で返します。
 *
 * @param dateString - ISO 8601形式の日時文字列（例: "2024-01-16T12:00:00Z"）
 *                     SupabaseのcreatedAtなどをそのまま渡せます
 * @returns 相対時間の文字列
 *
 * @example
 * // 質問カードで使用
 * <span>{formatTimeAgo(question.created_at)}</span>
 *
 * @example
 * // 出力例
 * formatTimeAgo("2024-01-16T12:00:00Z") // → "たった今"（60秒未満）
 * formatTimeAgo("2024-01-16T11:30:00Z") // → "30分前"
 * formatTimeAgo("2024-01-16T10:00:00Z") // → "2時間前"
 * formatTimeAgo("2024-01-14T12:00:00Z") // → "2日前"
 * formatTimeAgo("2023-12-16T12:00:00Z") // → "1ヶ月前"
 * formatTimeAgo("2023-01-16T12:00:00Z") // → "1年前"
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  // 現在時刻との差をミリ秒で取得し、秒に変換
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 60秒未満 → 「たった今」
  if (diffInSeconds < 60) {
    return "たった今";
  }

  // 60分未満 → 「〇分前」
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`;
  }

  // 24時間未満 → 「〇時間前」
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  }

  // 30日未満 → 「〇日前」
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}日前`;
  }

  // 12ヶ月未満 → 「〇ヶ月前」
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}ヶ月前`;
  }

  // 1年以上 → 「〇年前」
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}年前`;
}

// TODO: 必要になったらコメントアウトを解除
// /**
//  * 日付を「YYYY/MM/DD」形式にフォーマット
//  *
//  * ISO 8601形式の日時文字列を受け取り、
//  * 「2024/01/16」のような日本でよく使われる形式に変換します。
//  *
//  * @param dateString - ISO 8601形式の日時文字列（例: "2024-01-16T12:00:00Z"）
//  *                     SupabaseのcreatedAtなどをそのまま渡せます
//  * @returns 「YYYY/MM/DD」形式の日付文字列
//  *
//  * @example
//  * // プロフィールページで使用
//  * <span>登録日: {formatDate(profile.created_at)}</span>
//  *
//  * @example
//  * // 出力例
//  * formatDate("2024-01-16T12:00:00Z") // → "2024/01/16"
//  * formatDate("2024-05-01T00:00:00Z") // → "2024/05/01"（月・日は0埋め）
//  */
// export function formatDate(dateString: string): string {
//   const date = new Date(dateString);
//   // 年を取得
//   const year = date.getFullYear();
//   // 月を取得（0始まりなので+1）、1桁の場合は0埋め
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   // 日を取得、1桁の場合は0埋め
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}/${month}/${day}`;
// }
