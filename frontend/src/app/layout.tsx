import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "プログラム特区",
  description: "プログラミングの疑問を解決するQ&Aプラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
