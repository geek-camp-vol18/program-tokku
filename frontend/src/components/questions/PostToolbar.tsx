"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Code, FileText } from "lucide-react";

interface PostToolbarProps {
  content: string;
  setContent: (value: string) => void;
}

export function PostToolbar({ content, setContent }: PostToolbarProps) {
  // ファイル入力用のリモコン（参照）
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ロジック ---
  
  // 1. 画像ボタンが押された時
  const handleImageClick = () => imageInputRef.current?.click();

  // 2. ファイルボタンが押された時
  const handleFileClick = () => fileInputRef.current?.click();

  // 3. コード挿入ボタンが押された時
  const insertCodeBlock = () => {
    // 現在の入力内容の最後にコードブロックを追加
    const codeTemplate = "\n```\n\n```";
    setContent(content + codeTemplate);
    // ※ 本来はカーソル位置に挿入するのが理想ですが、まずは基盤として末尾追加にします
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`${type}: ${file.name} を選択しました（後ほどSupabase送信を実装）`);
    }
  };

  return (
    <div className="flex gap-2 pt-2">
      {/* 隠し入力：画像 */}
      <input 
        type="file" 
        ref={imageInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={(e) => handleFileChange(e, "画像")}
      />
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="h-8 text-xs gap-1.5" 
        onClick={handleImageClick}
      >
        <ImageIcon className="h-3 w-3" /> 画像を添付
      </Button>

      {/* コード挿入 */}
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="h-8 text-xs gap-1.5" 
        onClick={insertCodeBlock}
      >
        <Code className="h-3 w-3" /> コードを挿入
      </Button>

      {/* 隠し入力：ファイル */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => handleFileChange(e, "ファイル")}
      />
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="h-8 text-xs gap-1.5" 
        onClick={handleFileClick}
      >
        <FileText className="h-3 w-3" /> ファイルを添付
      </Button>
    </div>
  );
}