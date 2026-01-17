"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

// レート制限の設定
const MAX_ATTEMPTS = 5; // 最大試行回数
const LOCKOUT_DURATION = 60 * 1000; // ロックアウト時間（60秒）
const STORAGE_KEY = "login_rate_limit";

// メールアドレスバリデーション
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

const features = [
  "初心者歓迎のやさしいコミュニティ",
  "質問も回答もポイントがもらえる",
  "ランクアップで称号をゲット",
  "バッジで得意分野をアピール",
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // レート制限用の状態
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  // ロックアウト状態をlocalStorageから復元
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setFailedAttempts(data.attempts || 0);
      if (data.lockoutUntil && data.lockoutUntil > Date.now()) {
        setLockoutUntil(data.lockoutUntil);
      } else if (data.lockoutUntil) {
        // ロックアウト期間が終了していたらリセット
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // カウントダウンタイマー
  useEffect(() => {
    if (!lockoutUntil) {
      setRemainingTime(0);
      return;
    }

    const updateRemaining = () => {
      const remaining = Math.max(0, lockoutUntil - Date.now());
      setRemainingTime(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // 失敗回数を記録し、新しい回数を返す
  const recordFailedAttempt = useCallback((): number => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION;
      setLockoutUntil(lockoutTime);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ attempts: newAttempts, lockoutUntil: lockoutTime })
      );
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ attempts: newAttempts, lockoutUntil: null })
      );
    }

    return newAttempts;
  }, [failedAttempts]);

  // ログイン成功時にリセット
  const resetAttempts = useCallback(() => {
    setFailedAttempts(0);
    setLockoutUntil(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isLockedOut = lockoutUntil !== null && lockoutUntil > Date.now();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) {
      return;
    }

    setError("");

    // メールバリデーション
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // パスワード空チェック
    if (!password) {
      setError("パスワードを入力してください");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const newAttempts = recordFailedAttempt();
      const attemptsLeft = MAX_ATTEMPTS - newAttempts;

      if (error.message.includes("Email not confirmed")) {
        setError("メールアドレスの確認が完了していません。登録時に届いたメールのリンクをクリックしてください");
      } else if (error.message.includes("Invalid login credentials")) {
        if (attemptsLeft > 0) {
          setError(`メールアドレスまたはパスワードが正しくありません（残り${attemptsLeft}回）`);
        } else {
          setError("ログイン試行回数の上限に達しました。しばらくお待ちください");
        }
      } else {
        setError("ログインに失敗しました。もう一度お試しください");
      }
      setIsLoading(false);
      return;
    }

    // ログイン成功 → 試行回数リセット → ホームへリダイレクト
    resetAttempts();
    router.push("/");
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

      {/* 右側: ログインフォーム */}
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
            <h2 className="text-2xl font-bold text-foreground">おかえりなさい</h2>
            <p className="text-muted-foreground mt-2">
              アカウントにログインして、質問や回答を始めましょう
            </p>
          </div>

          <Card className="border-0 shadow-none lg:shadow-xl lg:border">
            <CardContent className="p-0 lg:p-6 space-y-6">

              {/* ロックアウト警告 */}
              {isLockedOut && (
                <div className="p-4 text-sm bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-2 text-amber-700 font-medium">
                    <Clock className="h-4 w-4" />
                    ログインが一時的に制限されています
                  </div>
                  <p className="mt-1 text-amber-600">
                    セキュリティのため、{remainingTime}秒後に再試行できます
                  </p>
                </div>
              )}

              {/* エラーメッセージ */}
              {error && !isLockedOut && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              {/* メールログイン */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">パスワード</Label>
                    <Link
                      href="/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      パスワードを忘れた方
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="パスワードを入力"
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

                <Button
                  type="submit"
                  className="w-full h-11 gap-2"
                  size="lg"
                  disabled={isLoading || isLockedOut}
                >
                  {isLockedOut ? (
                    <>
                      <Clock className="h-4 w-4" />
                      {remainingTime}秒後に再試行可能
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      ログイン中...
                    </>
                  ) : (
                    <>
                      ログイン
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                アカウントをお持ちでない方
                <Link
                  href="/signup"
                  className="ml-1 font-semibold text-primary hover:underline"
                >
                  新規登録
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
