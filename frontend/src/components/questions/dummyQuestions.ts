import type { Question } from "@/components/questions/types";

export function getDummyQuestions(): Question[] {
  return [
    {
      id: "q1",
      status: "open",
      title: "React useEffectで無限ループが発生してしまいます",
      excerpt:
        "コンポーネントがマウントされた時にAPIからデータを取得したいのですが、useEffectの中でsetStateを呼ぶと無限ループになってしまいます…",
      tags: ["React", "バグ"],
      authorName: "tanaka",
      authorInitial: "T",
      authorBadge: "初心者",
      createdAtLabel: "5分前",
      answerCount: 3,
      likeCount: 12,
    },
    {
      id: "q2",
      status: "open",
      title: "Next.js(App Router)でserver actionsを使うときの設計が分かりません",
      excerpt:
        "フォーム送信をServer Actionsで実装したいのですが、バリデーションやエラーハンドリングの置き場所が迷っています。おすすめの構成ありますか？",
      tags: ["Next.js", "TypeScript"],
      authorName: "suzuki",
      authorInitial: "S",
      createdAtLabel: "32分前",
      answerCount: 1,
      likeCount: 4,
    },
    {
      id: "q3",
      status: "resolved",
      title: "SupabaseのRow Level Securityで一覧が取得できなくなりました",
      excerpt:
        "RLSを有効化してポリシーを追加したら、selectが空配列になりました。auth.uid()周りの書き方が間違っている気がします。",
      tags: ["Supabase", "SQL", "セキュリティ"],
      authorName: "yamada",
      authorInitial: "Y",
      createdAtLabel: "1時間前",
      answerCount: 2,
      likeCount: 9,
    },
    {
      id: "q4",
      status: "open",
      title: "Tailwindで2カラムの幅比率をきれいに保つ方法は？",
      excerpt:
        "md:grid-cols-[2fr_1fr] で作っていますが、カード内要素によって幅感が崩れます。min-w-0など必要でしょうか？",
      tags: ["Tailwind", "UI"],
      authorName: "kato",
      authorInitial: "K",
      createdAtLabel: "2時間前",
      answerCount: 0,
      likeCount: 1,
    },
    {
      id: "q5",
      status: "resolved",
      title: "TypeScriptでUnion型の絞り込みがうまくいきません",
      excerpt:
        "in演算子やtypeofで絞り込んでいるつもりですが、プロパティにアクセスできずanyに逃げています。型ガードの書き方を教えてください。",
      tags: ["TypeScript"],
      authorName: "mori",
      authorInitial: "M",
      createdAtLabel: "昨日",
      answerCount: 4,
      likeCount: 20,
    },
    {
      id: "q6",
      status: "open",
      title: "shadcn/uiのButtonのvariantをプロジェクト全体で統一したい",
      excerpt:
        "ボタン色をemerald基調に寄せたいのですが、components/ui/button.tsx をどう設計するのが安全ですか？上書きの方針が知りたいです。",
      tags: ["shadcn/ui", "デザイン"],
      authorName: "aiu",
      authorInitial: "A",
      createdAtLabel: "3日前",
      answerCount: 1,
      likeCount: 7,
    },
  ];
}
