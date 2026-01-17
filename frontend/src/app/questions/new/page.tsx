"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Editor from "@monaco-editor/react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PostToolbar } from "@/components/questions/PostToolbar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Loader2, Trash2 } from "lucide-react";

import Link from "next/link";


type EditorBlock = {
  id: string;
  type: "text" | "code";
  value: string;
};

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "React", "Node.js", "Vue", "Go", "Java", "Ruby", "PHP"];
const CATEGORIES = ["バグ", "環境構築", "設計", "アルゴリズム", "パフォーマンス", "セキュリティ", "その他"];

export default function NewQuestionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [dbTags, setDbTags] = useState<{id: string, name: string}[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

// OSのファイルダイアログを開く
  const triggerImageSelect = () => imageInputRef.current?.click();
  const triggerFileSelect = () => fileInputRef.current?.click();

  // ファイルが選ばれた時の処理（今はログを出すだけ）
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("ファイルが選択されました:", file.name);
      // ここに将来、Supabaseへのアップロード処理を書く
    }
  };
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase.from("tags").select("*");
      if (data) setDbTags(data);
    };
    fetchTags();
  }, []);
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: crypto.randomUUID(), type: "text", value: "" },
  ]);

  const updateBlock = (id: string, value: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, value } : b)));
  };

  const addCodeBlock = () => {
    setBlocks([...blocks, { id: crypto.randomUUID(), type: "code", value: "" }]);
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter((b) => b.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (!title || blocks[0].value === "" || selectedTagIds.length === 0) {
      alert("タイトル、詳細、およびタグの選択は必須です");
      return;
    }

    const fullContent = blocks
      .map((b) => (b.type === "code" ? `\`\`\`\n${b.value}\n\`\`\`` : b.value))
      .join("\n\n");

    setIsSubmitting(true);
    try {
      // STEP 1: questionsテーブルに本体を保存し、生成されたIDを受け取る
      const { data: question, error: qError } = await supabase
        .from("questions")
        .insert([{ 
          id: crypto.randomUUID(), // ★ フロント側でUUIDを生成して送り込む
          title, 
          content: fullContent, 
          status: "open" 
        }])
        .select("id")
        .single();

      if (qError) throw qError;

      // STEP 2: 選ばれた全てのタグIDを question_tags に保存
      const tagInserts = selectedTagIds.map(tagId => ({
        id: crypto.randomUUID(),     // 仮置き
        question_id: question.id,
        tag_id: tagId
      }));

      const { error: tError } = await supabase
        .from("question_tags")
        .insert(tagInserts);

      if (tError) throw tError;

      alert("質問を投稿しました！");
      router.push("/");
    } catch (error: any) {
      alert("エラーが発生しました: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted font-sans text-foreground">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />

        <main className="w-full flex-1 px-6 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link 
                  href="/" 
                  className="hover:text-foreground transition-colors"
                >
                  ホーム
                </Link>
                <span>/</span>
                <span className="font-medium text-foreground">質問を投稿</span>
              </nav>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">質問を投稿する</h1>
                <p className="text-sm text-muted-foreground">困っていることを詳しく書いて、解決のヒントをもらいましょう</p>
              </div>

              <Card className="bg-card border-none shadow-sm">
                <CardContent className="p-6 space-y-8">
                  {/* タイトル */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold">タイトル <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="例：React useEffectで無限ループが発生する" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  {/* 詳細 */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold">詳細 <span className="text-red-500">*</span></label>
                    <div className="border rounded-md bg-background overflow-hidden p-1 focus-within:ring-2 focus-within:ring-ring">
                      <div className="space-y-2">
                        {blocks.map((block, index) => (
                          <div key={block.id} className="group relative">
                            {block.type === "text" ? (
                              <Textarea
                                placeholder={index === 0 ? "やりたいこと、試したことなどを詳しく書いてください" : ""}
                                value={block.value}
                                onChange={(e) => updateBlock(block.id, e.target.value)}
                                className="min-h-[100px] border-none shadow-none focus-visible:ring-0 text-base resize-none bg-transparent"
                              />
                            ) : (
                              <div className="relative border rounded-md overflow-hidden h-[250px] bg-[#1e1e1e] mx-2 my-1">
                                <Editor
                                  height="100%"
                                  defaultLanguage="python"
                                  theme="vs-dark"
                                  value={block.value}
                                  onChange={(val) => updateBlock(block.id, val || "")}
                                  options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on" }}
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  onClick={() => removeBlock(block.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={imageInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />

                    {/* ツールバー */}
                    <PostToolbar 
                      onAddCode={addCodeBlock} 
                      onImageClick={triggerImageSelect} 
                      onFileClick={triggerFileSelect} 
                    />
                  </div>

                  {/* 言語・フレームワーク：必須に変更 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold">言語・フレームワーク <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {dbTags.map(tag => (
                        <Badge 
                          key={tag.id}
                          onClick={() => setSelectedTagIds(prev => 
                            prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                          )}
                          variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* カテゴリ：任意に変更 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold">カテゴリ（任意）</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <Badge 
                          key={cat}
                          onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                          variant={selectedCategory === cat ? "default" : "outline"}
                          className="cursor-pointer px-4 py-1"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="ghost" onClick={() => router.back()}>キャンセル</Button>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-muted-foreground">+5pt</span>
                      <Button 
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="bg-emerald-500 hover:bg-emerald-600 px-8 font-bold text-white"
                      >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        質問を投稿する
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="hidden md:block">
              <Card className="p-6 bg-card border-none shadow-sm sticky top-8">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-emerald-600 text-sm">
                  <Lightbulb className="h-4 w-4" /> 良い質問のコツ
                </h3>
                <ul className="space-y-4 text-xs text-muted-foreground leading-relaxed"> {/* ← ここを text-xs か text-sm に変更 */}
                  <li><span className="font-bold text-foreground">1. ゴールを明確に</span><br/>最終的にやりたいことを書く</li>
                  <li><span className="font-bold text-foreground">2. 試したことを書く</span><br/>すでに試した解決策を共有</li>
                  <li><span className="font-bold text-foreground">3. エラー内容を添付</span><br/>エラーメッセージやスクショを貼る</li>
                  <li><span className="font-bold text-foreground">4. コードを共有</span><br/>問題のあるコードを貼る</li>
                </ul>
              </Card>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}