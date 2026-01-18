"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Paperclip, Code, Send, Image, FileText } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { AnswerCard, type AnswerRow } from "@/components/questions/AnswerCard";
import { PointEarnedModal } from "@/components/points/PointEarnedModal";

type Props = {
  questionId: string;
  questionUserId: string;
  answers: AnswerRow[];
  onAnswerPosted: () => void;
  onBestAnswerSelected: (answerId: string) => void;
};

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "", label: "その他" },
];

export function AnswerSection({
  questionId,
  questionUserId,
  answers,
  onAnswerPosted,
  onBestAnswerSelected,
}: Props) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 現在のユーザーを取得
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // テキストエリアにテキストを挿入
  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.slice(0, start) + text + content.slice(end);
    setContent(newContent);

    // カーソル位置を調整
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    }, 0);
  };

  // コード挿入
  const handleCodeInsert = (language: string) => {
    const codeBlock = `\n\`\`\`${language}\n// コードをここに入力\n\`\`\`\n`;
    insertText(codeBlock);
    setIsCodeDialogOpen(false);
  };

  // ファイル添付
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError("ファイルサイズは5MB以下にしてください");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // ユーザー確認
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError("ファイルをアップロードするにはログインが必要です");
        setIsUploading(false);
        return;
      }

      // ファイル名を生成
      const fileExt = file.name.split(".").pop();
      const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;

      // Supabase Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("answers")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        setError("ファイルのアップロードに失敗しました");
        setIsUploading(false);
        return;
      }

      // 公開URLを取得
      const { data: urlData } = supabase.storage
        .from("answers")
        .getPublicUrl(fileName);

      // 画像かどうかで挿入形式を変える
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        insertText(`\n![${file.name}](${urlData.publicUrl})\n`);
      } else {
        insertText(`\n[${file.name}](${urlData.publicUrl})\n`);
      }
    } catch (err) {
      console.error("File upload error:", err);
      setError("ファイルのアップロードに失敗しました");
    }

    setIsUploading(false);
    // inputをリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("回答内容を入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // ユーザー確認
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("回答するにはログインが必要です");
      setIsSubmitting(false);
      return;
    }

    // 回答を投稿
    const { error: insertError } = await supabase.from("answers").insert({
      id: crypto.randomUUID(),
      question_id: questionId,
      user_id: userData.user.id,
      content: content.trim(),
      is_best_answer: false,
    });

    if (insertError) {
      console.error("Answer insert error:", insertError.message);
      setError("回答の投稿に失敗しました");
      setIsSubmitting(false);
      return;
    }

    // ポイント付与（+10pt）
    const { error: pointError } = await supabase.rpc("increment_points", {
      user_id: userData.user.id,
      amount: 10,
    });

    if (pointError) {
      console.error("ポイント付与エラー:", pointError.message);
    }

    // 成功 - モーダルを先に表示（onAnswerPostedはモーダルを閉じた後に呼ぶ）
    setContent("");
    setIsSubmitting(false);
    setShowPointModal(true);
  };

  const isQuestionOwner = currentUserId === questionUserId;
  const hasBestAnswer = answers.some((a) => a.is_best_answer);

  return (
    <>
      {/* ポイント獲得モーダル */}
      <PointEarnedModal
        isOpen={showPointModal}
        onClose={() => {
          setShowPointModal(false);
          onAnswerPosted(); // モーダルを閉じた後にデータ再取得
        }}
        points={10}
        message="回答を投稿しました！"
      />

      <div className="space-y-4">
        <div className="text-sm font-medium text-muted-foreground">
          回答（{answers.length}件）
        </div>

      {answers.length === 0 ? (
        <Card className="p-5 text-sm text-muted-foreground">まだ回答はありません</Card>
      ) : (
        <div className="space-y-4">
          {answers.map((a) => (
            <AnswerCard
              key={a.id}
              answer={a}
              showBestAnswerButton={isQuestionOwner && !hasBestAnswer && !a.is_best_answer}
              onSelectBestAnswer={() => onBestAnswerSelected(a.id)}
            />
          ))}
        </div>
      )}

      {/* 回答投稿フォーム */}
      <Card className="p-6 space-y-4">
        <div className="font-medium">回答を投稿する</div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <Textarea
          ref={textareaRef}
          placeholder="回答内容を入力..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* ファイル添付 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
              ファイル添付
            </Button>

            {/* コード挿入 */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => setIsCodeDialogOpen(true)}
            >
              <Code className="h-4 w-4" />
              コード挿入
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                投稿中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                回答を投稿
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* コード挿入ダイアログ */}
      <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>コードブロックを挿入</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 py-4">
            {CODE_LANGUAGES.map((lang) => (
              <Button
                key={lang.value}
                variant="outline"
                size="sm"
                onClick={() => handleCodeInsert(lang.value)}
                className="justify-start"
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
