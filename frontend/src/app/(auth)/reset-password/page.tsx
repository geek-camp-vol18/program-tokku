"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password/confirm`,
    });

    if (error) {
      setError("メールの送信に失敗しました。もう一度お試しください");
      setIsLoading(false);
      return;
    }

    setIsSent(true);
    setIsLoading(false);
  };

  // メール送信完了画面
  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            メールを送信しました
          </h2>
          <p className="text-muted-foreground mb-6">
            {email} にパスワードリセット用のメールを送信しました。
            <br />
            メール内のリンクからパスワードを再設定してください。
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full h-11 gap-2" size="lg">
              ログイン画面に戻る
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
            <h2 className="text-2xl font-bold text-foreground">パスワードをお忘れの方</h2>
          </div>
          <p className="text-muted-foreground">
            登録したメールアドレスを入力してください
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

              <Button type="submit" className="w-full h-11 gap-2" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    リセットメールを送信
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
