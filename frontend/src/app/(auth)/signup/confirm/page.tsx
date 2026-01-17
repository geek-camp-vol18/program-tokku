"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SignupConfirmPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <Sprout className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-foreground">プログラム特区</h1>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            {/* アイコン */}
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* タイトル */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              メールを確認してください
            </h2>

            {/* 説明文 */}
            <p className="text-muted-foreground mb-6">
              {email ? (
                <>
                  <span className="font-medium text-foreground">{email}</span>
                  <br />
                  に確認メールを送信しました。
                </>
              ) : (
                "登録したメールアドレスに確認メールを送信しました。"
              )}
              <br />
              <br />
              メール内のリンクをクリックして、
              <br />
              アカウントの登録を完了してください。
            </p>

            {/* 注意事項 */}
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground mb-6 text-left">
              <p className="font-medium text-foreground mb-2">メールが届かない場合</p>
              <ul className="list-disc list-inside space-y-1">
                <li>迷惑メールフォルダを確認してください</li>
                <li>入力したメールアドレスが正しいか確認してください</li>
                <li>数分待ってから再度ご確認ください</li>
              </ul>
            </div>

            {/* ログインへ */}
            <Link href="/login">
              <Button variant="outline" className="w-full h-11 gap-2" size="lg">
                ログイン画面へ
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
