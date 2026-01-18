"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, Code, FileText } from "lucide-react";

interface PostToolbarProps {
  onAddCode: () => void;
  onImageClick: () => void; // 追加
  onFileClick: () => void;  // 追加
}

export function PostToolbar({ onAddCode, onImageClick, onFileClick }: PostToolbarProps) {
  return (
    <div className="flex gap-2 py-4 border-t border-b border-dashed border-muted-foreground/20">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="text-muted-foreground hover:text-foreground"
        onClick={onImageClick} // 接続
      >
        <ImageIcon className="h-4 w-4 mr-2" /> 画像を添付
      </Button>

      <Button 
        type="button" 
        variant="secondary" 
        size="sm" 
        className="font-bold gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none" 
        onClick={onAddCode}
      >
        <Code className="h-4 w-4" /> コードを挿入
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="text-muted-foreground hover:text-foreground"
        onClick={onFileClick} // 接続
      >
        <FileText className="h-4 w-4 mr-2" /> ファイルを添付
      </Button>
    </div>
  );
}