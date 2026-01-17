"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sprout, PlusCircle, User, LogOut, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>("");

  // クライアントサイドでのみ描画を確定させる（ハイドレーションエラー防止）
  useEffect(() => {
    setMounted(true);
  }, []);

  // ログイン状態を監視
  useEffect(() => {
    // 初期チェック
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user) {
        // プロフィールからユーザー名を取得
        supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => {
            setUsername(profile?.username || "");
          });
      }
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUsername(profile?.username || "");
          });
      } else {
        setUsername("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const userInitial = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-6">
        {/* 左側: ロゴ */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            プログラム特区
          </span>
        </Link>

        {/* 右側: アクション */}
        <div className="flex items-center gap-3">
          {/* ログイン状態確認中（SSR/CSR一致のため mounted で制御） */}
          {!mounted || isLoggedIn === null ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : isLoggedIn ? (
            <>
              {/* ログイン済み */}
              <Link href="/questions/new">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">質問する</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 focus:outline-none">
                    <Avatar className="h-9 w-9 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
                      <AvatarImage src="/avatar.png" alt="ユーザー" />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      マイページ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* 未ログイン */}
              <Link href="/login">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  ログイン
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  新規登録
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
