"use client";

import type { QuestionListItem } from "@/components/Home/homeTypes";

function isoHoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

export const dummyQuestions: QuestionListItem[] = [
  {
    id: "q1",
    user_id: "u1",
    title: "TypeScriptの型エラーが解消できません",
    content:
      "Genericsを使った関数を書いているのですが、`Type 'T' is not assignable to type 'string'` というエラーが出て困っています。どこを直せば良いでしょうか？",
    image_url: null,
    status: "open",
    created_at: isoHoursAgo(3),

    answer_count: 2,
    like_count: 15,
    tags: ["TypeScript", "バグ"],
    author: {
      id: "u1",
      username: "yamada",
      avatar_url: null,
      rank_name: "中級者",
    },
  },
  {
    id: "q2",
    user_id: "u2",
    title: "Next.jsでSupabaseの取得が空になります",
    content:
      "selectの書き方が悪いのか data が null になります。RLSや権限設定も影響しますか？最低限のチェックポイントを知りたいです。",
    image_url: null,
    status: "open",
    created_at: isoHoursAgo(10),

    answer_count: 0,
    like_count: 3,
    tags: ["Next.js", "Supabase"],
    author: {
      id: "u2",
      username: "suzuki",
      avatar_url: null,
      rank_name: "初級者",
    },
  },
  {
    id: "q3",
    user_id: "u3",
    title: "ReactのuseEffectの依存配列がよくわかりません",
    content:
      "依存配列に何を入れるべきかで無限ループになったりします。基本ルールとよくあるミスを教えてください。",
    image_url: null,
    status: "closed",
    created_at: isoHoursAgo(30),

    answer_count: 4,
    like_count: 21,
    tags: ["React", "useEffect"],
    author: {
      id: "u3",
      username: "tanaka",
      avatar_url: null,
      rank_name: "上級者",
    },
  },
];
