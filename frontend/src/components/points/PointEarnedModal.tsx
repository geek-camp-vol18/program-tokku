"use client";

import { useEffect, useState } from "react";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PointEarnedModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  message: string;
}

// 紙吹雪のパーツ
function Confetti() {
  const colors = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#fbbf24", "#f59e0b"];
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// キラキラエフェクト
function SparkleEffect() {
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: 20 + Math.random() * 60,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 1,
    size: 12 + Math.random() * 12,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <Star
          key={sparkle.id}
          className="absolute text-yellow-400 fill-yellow-400 animate-sparkle"
          style={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function PointEarnedModal({
  isOpen,
  onClose,
  points,
  message,
}: PointEarnedModalProps) {
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowEffects(true);
    } else {
      setShowEffects(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center overflow-hidden">
        {/* 紙吹雪 */}
        {showEffects && <Confetti />}

        {/* キラキラ */}
        {showEffects && <SparkleEffect />}

        <div className="relative z-10">
          <DialogHeader className="space-y-4">
            {/* アイコン */}
            <div className="flex justify-center animate-bounce-in">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/40 animate-float">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            {/* ポイント表示 */}
            <div
              className="text-5xl font-bold text-primary text-center animate-bounce-in animate-pulse-glow"
              style={{ animationDelay: "0.1s" }}
            >
              +{points}pt
            </div>

            {/* タイトル */}
            <DialogTitle
              className="text-xl text-center animate-bounce-in"
              style={{ animationDelay: "0.2s" }}
            >
              ポイント獲得！
            </DialogTitle>

            {/* メッセージ */}
            <DialogDescription
              className="text-base animate-bounce-in"
              style={{ animationDelay: "0.3s" }}
            >
              {message}
            </DialogDescription>
          </DialogHeader>

          {/* ボタン */}
          <div
            className="mt-6 animate-bounce-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              onClick={onClose}
              className="w-full h-12 text-lg font-bold transition-transform hover:scale-105 active:scale-95"
              size="lg"
            >
              やったね！
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
