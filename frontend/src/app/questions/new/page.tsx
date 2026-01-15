"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Image as ImageIcon, Code, FileText } from "lucide-react";

// 選択肢のマスターデータ
const LANGUAGES = ["Python", "JavaScript", "TypeScript", "React", "Node.js", "Vue", "Go", "Java", "Ruby", "PHP"];
const CATEGORIES = ["バグ", "環境構築", "設計", "アルゴリズム", "パフォーマンス", "セキュリティ", "その他"];

export default function NewQuestionPage() {
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

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 flex gap-8 items-start">
        
        {/* === 左側メインエリア === */}
        <div className="flex-1 space-y-6">
          
          {/* ヘッダー */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">質問を投稿する</h1>
            <p className="text-slate-500 text-sm mt-1">困っていることを詳しく書いて、コミュニティに質問しましょう</p>
          </div>

          {/* 応援メッセージ (Figmaの緑のエリア) */}
          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl flex gap-4 items-start">
            <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-emerald-800 font-bold text-sm mb-1">初めての質問、応援します</h3>
              <p className="text-emerald-700 text-xs leading-relaxed">
                どんな質問でも大丈夫です。みんな最初は初心者でした。丁寧に回答してもらえるコミュニティです。
              </p>
            </div>
          </div>

          {/* 入力フォームカード */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-8 space-y-8">
              
              {/* タイトル入力 */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">困っていることを一言で表現してください</p>
                  <Input 
                    placeholder="例：React useEffectで無限ループが発生する" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 詳細入力 */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900">
                  詳細 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">やりたいこと、試したこと、エラー内容などを詳しく書いてください</p>
                  <Textarea 
                    placeholder={`【やりたいこと】 コンポーネントがマウントされた時にAPIからデータを取得したい\n【試したこと】 useEffectの中でfetchを呼び出した\n【エラー内容】 コンソールに「fetching...」が延々と出力される`}
                    className="min-h-[300px] font-mono text-sm bg-slate-50 border-slate-200 focus:ring-emerald-500 leading-relaxed"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  {/* ツールバーボタン（見た目だけ） */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="text-xs gap-2 text-slate-600 h-8">
                      <ImageIcon className="h-3 w-3" /> 画像を添付
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs gap-2 text-slate-600 h-8">
                      <Code className="h-3 w-3" /> コードを挿入
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs gap-2 text-slate-600 h-8">
                      <FileText className="h-3 w-3" /> ファイルを添付
                    </Button>
                  </div>
                </div>
              </div>

              {/* 言語・フレームワーク選択 */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900">
                  言語・フレームワーク <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500">関連する言語やフレームワークを選択してください（複数選択可）</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <Badge 
                      key={lang}
                      onClick={() => toggleLang(lang)}
                      variant={selectedLangs.includes(lang) ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-1.5 text-sm transition-all ${
                        selectedLangs.includes(lang) 
                          ? "bg-emerald-500 hover:bg-emerald-600 border-transparent" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-emerald-200"
                      }`}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* カテゴリ選択 */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900">カテゴリ</label>
                <p className="text-xs text-slate-500">質問の種類を選択してください</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Badge 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-1.5 text-sm transition-all ${
                        selectedCategory === cat
                          ? "bg-slate-800 hover:bg-slate-700 border-transparent text-white" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* フッターアクション */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                  キャンセル
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400">+5pt</span>
                  <Button className="bg-emerald-400 hover:bg-emerald-500 text-white px-8 font-bold shadow-md shadow-emerald-100">
                    質問を投稿する
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* === 右側サイドバー (コツ) === */}
        <aside className="w-80 hidden lg:block shrink-0 sticky top-6">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-800">
                <Lightbulb className="h-4 w-4 text-emerald-500" /> 良い質問のコツ
              </h3>
              <ul className="space-y-6 relative">
                {/* 縦線 */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 -z-10" />
                
                {[
                  { title: "ゴールを明確に", desc: "最終的にやりたいことを書く" },
                  { title: "試したことを書く", desc: "すでに試した解決策を共有" },
                  { title: "エラー内容を添付", desc: "エラーメッセージやスクショを貼る" },
                  { title: "コードを共有", desc: "問題のあるコードを貼る" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-emerald-200 text-emerald-600 text-xs font-bold shadow-sm shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <strong className="block text-sm text-slate-800 mb-0.5">{item.title}</strong>
                      <p className="text-xs text-slate-500 leading-tight">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

      </div>
    </div>
  );
}