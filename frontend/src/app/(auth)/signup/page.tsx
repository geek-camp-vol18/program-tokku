"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

// バリデーション関数
function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "メールアドレスを入力してください";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "有効なメールアドレスを入力してください";
  }
  return null;
}

function validateUsername(username: string): string | null {
  const trimmed = username.trim();
  if (!trimmed) {
    return "ユーザー名を入力してください";
  }
  if (trimmed.length > 20) {
    return "ユーザー名は20文字以内で入力してください";
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "パスワードは8文字以上で入力してください";
  }
  return null;
}

const features = [
  "初心者歓迎のやさしいコミュニティ",
  "質問も回答もポイントがもらえる",
  "ランクアップで称号をゲット",
  "バッジで得意分野をアピール",
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // バリデーション
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setIsLoading(true);

    // 1. Supabase Authでユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      // セキュリティ: メールアドレスの存在を特定されないよう統一メッセージ
      setError("登録に失敗しました。入力内容を確認してもう一度お試しください");
      setIsLoading(false);
      return;
    }

    // 2. profilesテーブルにレコード作成
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username: username.trim(),
        points: 0,
        solved_count: 0,
        answer_count: 0,
      });

      if (profileError) {
        console.error("Error creating profile:", profileError.message);
        setError("プロフィールの作成に失敗しました");
        setIsLoading(false);
        return;
      }
    }

    // 登録成功 → メール確認画面へリダイレクト
    router.push(`/signup/confirm?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/20 via-primary/10 to-background">
      {/* 左側: ブランディング */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center gap-12 p-12">
        <div className="flex gap-3 items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold text-foreground">プログラム特区</span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              プログラミングで
              <br />
              困ったら、
              <br />
              <span className="text-primary">ここで質問。</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              初心者でも安心して質問できる、やさしいQ&Aコミュニティ。
            </p>
          </div>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右側: 登録フォーム */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* モバイル用ロゴ */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
              <Sprout className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold text-foreground">プログラム特区</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">新規登録</h2>
            <p className="text-muted-foreground mt-2">
              アカウントを作成して、質問や回答を始めましょう
            </p>
          </div>

          <Card className="border-0 shadow-none lg:shadow-xl lg:border">
            <CardContent className="p-0 lg:p-6 space-y-6">
              {/* エラーメッセージ */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              {/* ユーザー名 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">ユーザー名</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="ユーザー名を入力"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 focus-visible:ring-primary"
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    20文字以内
                  </p>
                </div>
              {/* メール登録 */}
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="8文字以上のパスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 h-11 focus-visible:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 gap-2" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      登録中...
                    </>
                  ) : (
                    <>
                      新規登録
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                すでにアカウントをお持ちの方
                <Link
                  href="/login"
                  className="ml-1 font-semibold text-primary hover:underline"
                >
                  ログイン
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
