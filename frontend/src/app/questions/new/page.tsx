"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 画面遷移用
import { supabase } from "@/lib/supabase";

// チーム共通コンポーネント
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// UI部品
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Image as ImageIcon, Code, FileText, Loader2 } from "lucide-react";

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "React", "Node.js", "Vue", "Go", "Java", "Ruby", "PHP"];
const CATEGORIES = ["バグ", "環境構築", "設計", "アルゴリズム", "パフォーマンス", "セキュリティ", "その他"];

export default function NewQuestionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力データ
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // タグの選択切り替え処理
  const toggleLang = (lang: string) => {
    if (selectedLangs.includes(lang)) {
      setSelectedLangs(selectedLangs.filter(l => l !== lang));
    } else {
      setSelectedLangs([...selectedLangs, lang]);
    }
  };

  // ★ Supabaseへの保存処理 ★
  const handleSubmit = async () => {
    if (!title || !content) {
      alert("タイトルと詳細は必須です");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 質問を questions テーブルに挿入
      const { data, error } = await supabase
        .from("questions")
        .insert([
          {
            title,
            content,
            status: "open", // デフォルトは未解決
            // ※タグやカテゴリの保存先はDB設計に合わせて調整してください
          },
        ])
        .select();

      if (error) throw error;

      alert("質問を投稿しました！ +5pt獲得！");
      router.push("/"); // ホーム画面に戻る
      router.refresh(); // 最新の状態に更新
    } catch (error: any) {
      alert("エラーが発生しました: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* チーム共通のヘッダー */}
      <Header />

      <div className="mx-auto flex w-full max-w-7xl">
        {/* チーム共通のサイドバー */}
        <Sidebar />

        {/* メインコンテンツエリア：チームのグリッド構成(2fr 1fr)に合わせる */}
        <main className="w-full flex-1 px-6 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
            
            {/* 左：投稿フォーム */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">質問を投稿する</h1>
                <p className="text-sm text-muted-foreground">困っていることを詳しく書いて、解決のヒントをもらいましょう</p>
              </div>

              {/* 応援メッセージ */}
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 items-start">
                <Lightbulb className="h-5 w-5 text-emerald-600 mt-0.5" />
                <p className="text-emerald-800 text-xs leading-relaxed">
                  どんな質問でも大丈夫です。みんな最初は初心者でした。丁寧に回答してもらえるコミュニティです。
                </p>
              </div>

              <Card className="bg-card">
                <CardContent className="p-6 space-y-8">
                  {/* タイトル */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold">タイトル <span className="text-red-500">*</span></label>
                    <Input 
                      placeholder="例：React useEffectで無限ループが発生する" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* 詳細 */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold">詳細 <span className="text-red-500">*</span></label>
                    <Textarea 
                      placeholder="試したことやエラー内容を詳しく書いてください" 
                      className="min-h-[250px] font-mono"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="m"className="h-10 px-4 text-xs gap-1.5"><ImageIcon className="h-3 w-3"/> 画像を添付</Button>
                      <Button variant="outline" size="m"className="h-10 px-4 text-xs gap-1.5"><Code className="h-3 w-3"/> コードを挿入</Button>
                      <Button variant="outline" size="m"className="h-10 px-4 text-xs gap-1.5"><FileText className="h-3 w-3"/> ファイルを添付</Button>
                    </div>
                  </div>

                  {/* 言語選択 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold">言語・フレームワーク</label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map(lang => (
                        <Badge 
                          key={lang}
                          onClick={() => toggleLang(lang)}
                          variant={selectedLangs.includes(lang) ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* カテゴリ選択 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold">カテゴリ</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <Badge 
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          variant={selectedCategory === cat ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 送信ボタン */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="ghost" onClick={() => router.back()}>キャンセル</Button>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-muted-foreground">+5pt</span>
                      <Button 
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="bg-emerald-500 hover:bg-emerald-600 px-8"
                      >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        質問を投稿する
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右：ガイドライン（チームの FeaturePanel と同じ位置） */}
            <aside className="space-y-6">
              <Card className="p-6 bg-card border-none shadow-sm">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <Lightbulb className="h-4 w-4 text-emerald-500" /> 良い質問のコツ
                </h3>
                <ul className="space-y-4 text-xs text-muted-foreground">
                  <li><strong>1. ゴールを明確に</strong><br/>最終的に何を達成したいのか書きましょう。</li>
                  <li><strong>2. 試したことを書く</strong><br/>すでに試した解決策を共有すると回答が早くなります。</li>
                  <li><strong>3. エラーを共有</strong><br/>エラーメッセージはコピーして貼り付けましょう。</li>
                </ul>
              </Card>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}