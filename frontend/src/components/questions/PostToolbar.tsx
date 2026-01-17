"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, Code, FileText } from "lucide-react";

interface PostToolbarProps {
  onAddCode: () => void;
}

export function PostToolbar({ onAddCode }: PostToolbarProps) {
  return (
    <div className="flex gap-2 py-4 border-t border-b border-dashed border-muted-foreground/20">
      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
        <ImageIcon className="h-4 w-4 mr-2" /> 画像
      </Button>

      <Button 
        type="button" 
        variant="secondary" 
        size="sm" 
        className="font-bold gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none" 
        onClick={onAddCode}
      >
        <Code className="h-4 w-4" /> コードを追加
      </Button>

      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
        <FileText className="h-4 w-4 mr-2" /> ファイル
      </Button>
    </div>
  );
}