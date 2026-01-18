"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  questionId: string;
  questionUserId: string;
  initialLikeCount: number;
  onLikeChanged?: (newCount: number) => void;
};

export function LikeButton({ questionId, questionUserId, initialLikeCount, onLikeChanged }: Props) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // ユーザーとイイネ状態を取得
  useEffect(() => {
    async function checkLikeStatus() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      setUserId(userData.user.id);

      // 既にいいねしているか確認
      const { data: likeData } = await supabase
        .from("likes")
        .select("id")
        .eq("question_id", questionId)
        .eq("user_id", userData.user.id)
        .maybeSingle();

      setIsLiked(!!likeData);
    }

    checkLikeStatus();
  }, [questionId]);

  // 自分の質問かどうか
  const isOwnQuestion = userId === questionUserId;

  const handleLike = async () => {
    if (!userId) {
      alert("いいねするにはログインが必要です");
      return;
    }

    if (isOwnQuestion) {
      return;
    }

    setIsLoading(true);

    if (isLiked) {
      // いいね解除
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("question_id", questionId)
        .eq("user_id", userId);

      if (!error) {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        onLikeChanged?.(likeCount - 1);
      }
    } else {
      // いいね追加
      const { error } = await supabase.from("likes").insert({
        id: crypto.randomUUID(),
        question_id: questionId,
        user_id: userId,
      });

      if (error) {
        console.error("Like insert error:", error.message);
      } else {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        onLikeChanged?.(likeCount + 1);

        // 質問投稿者にポイント付与（+2pt）
        const { data: question } = await supabase
          .from("questions")
          .select("user_id")
          .eq("id", questionId)
          .single();

        if (question?.user_id && question.user_id !== userId) {
          await supabase.rpc("increment_points", {
            user_id: question.user_id,
            amount: 2,
          });
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isLoading || isOwnQuestion}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
        isOwnQuestion
          ? "text-muted-foreground/50 cursor-not-allowed"
          : isLiked
            ? "text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            : "text-muted-foreground hover:text-red-500 hover:bg-muted cursor-pointer"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
      <span className="tabular-nums text-sm font-medium">{likeCount}</span>
    </button>
  );
}
