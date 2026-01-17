"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PointEarnedModal } from "@/components/points/PointEarnedModal";

const testCases = [
  { points: 5, message: "質問を投稿しました！みんなからの回答を待ちましょう" },
  { points: 10, message: "回答を投稿しました！" },
  { points: 50, message: "ベストアンサーに選ばれました！" },
  { points: 2, message: "いいねをもらいました！" },
];

export default function PointModalTestPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(testCases[0]);

  const handleTest = (testCase: typeof testCases[0]) => {
    setCurrentTest(testCase);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PointEarnedModal テスト</h1>

      <div className="space-y-4">
        {testCases.map((testCase, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium">+{testCase.points}pt</p>
              <p className="text-sm text-muted-foreground">{testCase.message}</p>
            </div>
            <Button onClick={() => handleTest(testCase)}>
              テスト
            </Button>
          </div>
        ))}
      </div>

      <PointEarnedModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        points={currentTest.points}
        message={currentTest.message}
      />
    </div>
  );
}
