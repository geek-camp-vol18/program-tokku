"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Props = {
  questionId: string;
  initialLikeCount: number;
  onLikeChanged?: (newCount: number) => void;
};

export function LikeButton({ questionId, initialLikeCount, onLikeChanged }: Props) {
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

  const handleLike = async () => {
    if (!userId) {
      alert("いいねするにはログインが必要です");
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
      }
    }

    setIsLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={`gap-1 ${isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}`}
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      <span className="tabular-nums">{likeCount}</span>
    </Button>
  );
}
