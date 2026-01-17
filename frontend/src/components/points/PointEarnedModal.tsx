"use client";

import { Sparkles } from "lucide-react";
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

export function PointEarnedModal({
  isOpen,
  onClose,
  points,
  message,
}: PointEarnedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="space-y-4">
          {/* アイコン */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* ポイント表示 */}
          <div className="text-4xl font-bold text-primary">
            +{points}pt
          </div>

          {/* タイトル */}
          <DialogTitle className="text-xl">
            ポイント獲得！
          </DialogTitle>

          {/* メッセージ */}
          <DialogDescription className="text-base">
            {message}
          </DialogDescription>
        </DialogHeader>

        {/* ボタン */}
        <div className="mt-4">
          <Button onClick={onClose} className="w-full h-11" size="lg">
            やったね！
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
