"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkConnection() {
      try {
        // Supabaseに接続テスト
        const { error } = await supabase.from("_test_connection").select("*").limit(1);

        // テーブルが存在しないエラーは正常（接続はできている）
        if (error && (error.code === "42P01" || error.message.includes("find the table"))) {
          setStatus("connected");
          setMessage("Supabaseに接続できました！");
        } else if (error) {
          setStatus("error");
          setMessage(`エラー: ${error.message}`);
        } else {
          setStatus("connected");
          setMessage("Supabaseに接続できました！");
        }
      } catch (e) {
        setStatus("error");
        setMessage(`接続エラー: ${e}`);
      }
    }

    checkConnection();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">プログラム特区</h1>
      <p className="text-gray-600 mb-8">プログラミングの疑問を解決するQ&Aプラットフォーム</p>

      <div className="p-4 rounded-lg border w-full max-w-md">
        <h2 className="font-semibold mb-2">Supabase接続状態</h2>
        {status === "checking" && (
          <p className="text-yellow-600">確認中...</p>
        )}
        {status === "connected" && (
          <p className="text-green-600">{message}</p>
        )}
        {status === "error" && (
          <p className="text-red-600">{message}</p>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "未設定"}</p>
      </div>
    </main>
  );
}
