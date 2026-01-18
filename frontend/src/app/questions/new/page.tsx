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
import { PointEarnedModal } from "@/components/points/PointEarnedModal";

import Link from "next/link";

type EditorBlock = {
  id: string;
  type: "text" | "code";
  value: string;
};

// カテゴリの定数
const CATEGORIES = ["バグ", "環境構築", "設計", "アルゴリズム", "パフォーマンス", "セキュリティ", "その他"];
// 許可するファイルの拡張子
const ALLOWED_EXTENSIONS = ['pdf', 'zip', 'txt', 'csv', 'xlsx', 'docx', 'pptx'];

// 容量制限（MB）
const MAX_FILE_SIZE_MB = 5; 
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function NewQuestionPage() {
  const router = useRouter();

  // --- 状態管理 (State) ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [dbTags, setDbTags] = useState<{id: string, name: string}[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // 画像・ファイル管理(複数に変更)
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<{name: string, url: string}[]>([]);

  // ポイント獲得モーダル
  const [showPointModal, setShowPointModal] = useState(false);

  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: crypto.randomUUID(), type: "text", value: "" },
  ]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ログインチェック ---
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("質問を投稿するにはログインが必要です");
        router.push("/login");
        return;
      }
      setUserId(user.id);
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  // --- 初期データ取得 ---
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase.from("tags").select("*");
      if (data) setDbTags(data);
    };
    fetchTags();
  }, []);

  // --- エディタ操作関数 ---
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

  // --- ファイルアップロード操作 ---
  const triggerImageSelect = () => imageInputRef.current?.click();
  const triggerFileSelect = () => fileInputRef.current?.click();

  // 画像アップロード
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSubmitting(true);
    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split(".").pop();
        // 英数字のみの安全な名前を生成
        const storageKey = `img_${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("question-images")
          .upload(storageKey, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from("question-images")
          .getPublicUrl(storageKey);
        
        setImageUrls(prev => [...prev, publicUrl]);
      } catch {
        alert("画像のアップロードに失敗しました");
      }
    }
    setIsSubmitting(false);
    if(e.target) e.target.value = "";
  };

  // ファイル添付
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSubmitting(true);

    for (const file of Array.from(files)) {

      try {
        // --- 💡 ここがポイント ---
        const fileExt = file.name.split('.').pop();
        const storageKey = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("question-images")
          .upload(storageKey, file); // storageKey（英数字）で保存

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from("question-images")
          .getPublicUrl(storageKey);

        // 表示用の名前（attachmentsのname）には、元の file.name（日本語OK）を使う
        setAttachments(prev => [...prev, { name: file.name, url: publicUrl }]);
        
      } catch {
        alert(`${file.name} のアップロードに失敗しました`);
      }
    }
    setIsSubmitting(false);
    if(e.target) e.target.value = "";
  };
  // --- 送信処理 ---
  const handleSubmit = async () => {
    if (!userId) {
      alert("ログインが必要です");
      router.push("/login");
      return;
    }

    if (!title || blocks[0].value === "" || selectedTagIds.length === 0) {
      alert("タイトル、詳細、およびタグの選択は必須です");
      return;
    }

    let fullContent = blocks
      .map((b) => (b.type === "code" ? `\`\`\`\n${b.value}\n\`\`\`` : b.value))
      .join("\n\n");

    // 画像とファイルの埋め込み
    if (imageUrls.length > 0) {
      imageUrls.forEach((url, idx) => {
        fullContent = `![添付画像${idx + 1}](${url})\n\n` + fullContent;
      });
    }
    if (attachments.length > 0) {
      fullContent += "\n\n### 📎 添付ファイル\n";
      attachments.forEach(file => {
        fullContent += `- [${file.name}](${file.url})\n`;
      });
    }

    setIsSubmitting(true);
    try {
      // 1. 質問本体の保存（user_id追加、image_urlは最初の1枚またはnull）
      const { data: question, error: qError } = await supabase
        .from("questions")
        .insert([{
          id: crypto.randomUUID(),
          user_id: userId,
          title,
          image_url: imageUrls.length > 0 ? imageUrls[0] : null,
          content: fullContent,
          status: "open",
          category: selectedCategory || null,
        }])
        .select("id")
        .single();

      if (qError) throw qError;

      // 2. タグの保存
      const tagInserts = selectedTagIds.map(tagId => ({
        id: crypto.randomUUID(),
        question_id: question.id,
        tag_id: tagId
      }));

      const { error: tError } = await supabase
        .from("question_tags")
        .insert(tagInserts);

      if (tError) throw tError;

      // 3. ポイント付与（+5pt）
      const { error: pointError } = await supabase.rpc("increment_points", {
        user_id: userId,
        amount: 5
      });

      // ポイント付与エラーは警告のみ（質問投稿自体は成功させる）
      if (pointError) {
        console.error("ポイント付与エラー:", pointError.message);
      }

      // ポイント獲得モーダルを表示
      setShowPointModal(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "不明なエラー";
      alert("エラーが発生しました: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // モーダルを閉じてホームへ遷移
  const handleModalClose = () => {
    setShowPointModal(false);
    router.push("/");
  };

  // --- JSX (画面表示) ---

  // ログインチェック中は何も表示しない
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-muted font-sans text-foreground">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ポイント獲得モーダル */}
      <PointEarnedModal
        isOpen={showPointModal}
        onClose={handleModalClose}
        points={5}
        message="質問を投稿しました！"
      />
    <div className="min-h-screen bg-muted font-sans text-foreground">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />

        <main className="w-full flex-1 px-6 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {/* パンくずリスト */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
                <span>/</span>
                <span className="font-medium text-foreground">質問を投稿</span>
              </nav>
              
              <div>
                <h1 className="text-2xl font-bold tracking-tight">質問を投稿する</h1>
                <p className="text-sm text-muted-foreground">困っていることを詳しく書いて、解決のヒントをもらいましょう</p>
              </div>

              <Card className="bg-card border-none shadow-sm">
                <CardContent className="p-6 space-y-8">
                  {/* タイトル入力 */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold">タイトル <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="例：React useEffectで無限ループが発生する" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  {/* 詳細エディタ */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold">詳細 <span className="text-red-500">*</span></label>
                    <div className="border rounded-md bg-background overflow-hidden p-1 focus-within:ring-2 focus-within:ring-ring">
                      <div className="space-y-2">
                        {blocks.map((block, index) => (
                          <div key={block.id} className="group relative">
                            {block.type === "text" ? (
                              <div className="flex flex-col">
                                <Textarea
                                  placeholder={index === 0 ? "やりたいこと、試したことなどを詳しく書いてください" : ""}
                                  value={block.value}
                                  onChange={(e) => updateBlock(block.id, e.target.value)}
                                  className="min-h-[100px] border-none shadow-none focus-visible:ring-0 text-base resize-none bg-transparent"
                                />
                                
                                {/* 画像プレビュー */}
                                {/* 画像プレビュー：1番目のテキストブロックで、画像が1枚以上ある場合 */}
                                {index === 0 && imageUrls.length > 0 && (
                                  // 複数の画像を横並び（wrap）にするコンテナ
                                  <div className="flex flex-wrap gap-2 mx-2 my-2">
                                    {/* 配列 imageUrls をループして、1枚ずつ表示 */}
                                    {imageUrls.map((url, imgIdx) => (
                                      <div key={imgIdx} className="relative group/image border rounded-md overflow-hidden bg-muted/30 h-[150px]">
                                        <img 
                                          src={url} // ← ここは個別の「url」を使う
                                          alt={`添付画像-${imgIdx + 1}`}
                                          className="h-full w-auto object-contain mx-auto" 
                                        />
                                        {/* 削除ボタン */}
                                        <Button
                                          type="button" variant="destructive" size="icon"
                                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
                                          // ★ここが重要：クリックされた画像のインデックス(imgIdx)以外を残すことで削除する
                                          onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== imgIdx))}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* 添付ファイルリスト */}
                                {attachments.length > 0 && (
                                  <div className="mx-2 mt-2 space-y-2">
                                    {attachments.map((file, idx) => (
                                      <div key={idx} className="flex items-center justify-between p-2 text-sm border rounded bg-muted/50">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <span className="text-muted-foreground">📎</span>
                                          <span className="truncate">{file.name}</span>
                                        </div>
                                        <Button
                                          type="button" variant="ghost" size="sm"
                                          onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                                        >
                                          ×
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="relative border rounded-md overflow-hidden h-[250px] bg-[#1e1e1e] mx-2 my-1">
                                <Editor
                                  height="100%" defaultLanguage="python" theme="vs-dark" value={block.value}
                                  onChange={(val) => updateBlock(block.id, val || "")}
                                  options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on" }}
                                />
                                <Button
                                  variant="destructive" size="icon"
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

                      {/* 隠しinput */}
                      <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" />

                      {/* ツールバー */}
                      <PostToolbar 
                        onAddCode={addCodeBlock} 
                        onImageClick={triggerImageSelect} 
                        onFileClick={triggerFileSelect} 
                      />
                    </div>
                  </div>

                  {/* 言語・フレームワーク選択 (ここが復活！) */}
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

                  {/* カテゴリ選択 (ここも復活！) */}
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

                  {/* 送信ボタンエリア */}
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

            {/* サイドバー (コツ) */}
            <aside className="hidden md:block">
              <Card className="p-6 bg-card border-none shadow-sm sticky top-8">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-emerald-600 text-sm">
                  <Lightbulb className="h-4 w-4" /> 良い質問のコツ
                </h3>
                <ul className="space-y-4 text-xs text-muted-foreground leading-relaxed">
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
    </>
  );
}