"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  // セッションの確認（リセットリンクからのアクセスか確認）
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // バリデーション
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Password update error:", error.message);
      setError("パスワードの更新に失敗しました。もう一度お試しください");
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  };

  // セッション確認中
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 無効なアクセス（リセットリンク経由でない場合）
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <KeyRound className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            無効なリンクです
          </h2>
          <p className="text-muted-foreground mb-6">
            このリンクは無効か、有効期限が切れています。
            <br />
            もう一度パスワードリセットをお試しください。
          </p>
          <Link href="/reset-password">
            <Button variant="outline" className="w-full h-11 gap-2" size="lg">
              パスワードリセットへ
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // パスワード更新成功
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            パスワードを更新しました
          </h2>
          <p className="text-muted-foreground mb-6">
            新しいパスワードでログインできます。
          </p>
          <Link href="/login">
            <Button className="w-full h-11 gap-2" size="lg">
              ログイン画面へ
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <KeyRound className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">新しいパスワードを設定</h2>
          </div>
          <p className="text-muted-foreground">
            新しいパスワードを入力してください
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6 space-y-6">
            {/* エラーメッセージ */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 新しいパスワード */}
              <div className="space-y-2">
                <Label htmlFor="password">新しいパスワード</Label>
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

              {/* パスワード確認 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード確認</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="もう一度入力してください"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 h-11 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
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
                    更新中...
                  </>
                ) : (
                  <>
                    パスワードを更新
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                ログイン画面に戻る
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
