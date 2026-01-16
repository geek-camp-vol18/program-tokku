import Link from "next/link";
import { Heart, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// TODO: Supabaseから質問一覧を取得する
const mockQuestions = [
  {
    id: "1",
    title: "React useEffectで無限ループが発生してしまいます",
    content: "コンポーネントがマウントされた時にAPIからデータを取得したいのですが、useEffectの中でsetStateを呼ぶと無限ループになってしまいます...",
    status: "open" as const,
    created_at: "5分前",
    answerCount: 3,
    likeCount: 12,
    tags: ["React", "バグ"],
    user: {
      username: "tanaka",
      rank: "初心者",
      avatarInitial: "T",
    },
  },
  {
    id: "2",
    title: "React Routerでページ遷移ができない",
    content: "React Router v6を使っているのですが、Linkコンポーネントでページ遷移しようとしてもURLは変わるのに画面が更新されません...",
    status: "closed" as const,
    created_at: "3時間前",
    answerCount: 4,
    likeCount: 8,
    tags: ["React", "設計"],
    user: {
      username: "yamada",
      rank: "中級者",
      avatarInitial: "Y",
    },
  },
  {
    id: "3",
    title: "Reactでのstate管理について",
    content: "大規模なアプリケーションでのstate管理について悩んでいます。Redux、Zustand、Jotaiなど選択肢が多くてどれを使うべきか...",
    status: "closed" as const,
    created_at: "昨日",
    answerCount: 6,
    likeCount: 15,
    tags: ["React", "設計"],
    user: {
      username: "kimura",
      rank: "中級者",
      avatarInitial: "K",
    },
  },
];

interface PageProps {
  params: Promise<{ tag: string }>;
}

export default async function CategoryTagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  // TODO: question_tags経由で質問を取得
  const questions = mockQuestions;

  return (
    <div className="px-6 py-8 max-w-4xl">
      {/* パンくずリスト */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">ホーム</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-foreground">カテゴリ</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{decodedTag}</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{decodedTag}</h1>
        <p className="text-muted-foreground">{decodedTag}に関する質問</p>
      </div>

      {/* 質問数 */}
      <p className="text-sm text-primary font-medium mb-4">
        {questions.length}件の質問
      </p>

      {/* 質問一覧 */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            このカテゴリの質問はまだありません
          </p>
        ) : (
          questions.map((question) => (
            <Link key={question.id} href={`/questions/${question.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* 左側: 回答数（ステータスで色分け） */}
                    <div className="flex flex-col items-center justify-center px-5 py-4 min-w-[70px]">
                      <span className={`text-xl font-bold ${
                        question.status === "open" ? "text-amber-600" : "text-emerald-600"
                      }`}>{question.answerCount}</span>
                      <span className={`text-xs ${
                        question.status === "open" ? "text-amber-600" : "text-emerald-600"
                      }`}>回答</span>
                    </div>

                    {/* 右側: 質問内容 */}
                    <div className="flex-1 p-4">
                      {/* ステータスバッジ */}
                      <div className="mb-2">
                        {question.status === "open" ? (
                          <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 gap-1">
                            <Clock className="w-3 h-3" />
                            回答募集中
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-400 bg-emerald-50 gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            解決済み
                          </Badge>
                        )}
                      </div>

                      {/* タイトル */}
                      <h3 className="font-semibold text-lg mb-2">{question.title}</h3>

                      {/* 内容抜粋 */}
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {question.content}
                      </p>

                      {/* タグ */}
                      <div className="flex gap-2 mb-3">
                        {question.tags.map((tagName) => (
                          <Badge key={tagName} variant="secondary" className="text-xs">
                            {tagName}
                          </Badge>
                        ))}
                      </div>

                      {/* ユーザー情報といいね */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* アバター */}
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                            {question.user.avatarInitial}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            @{question.user.username}
                          </span>
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {question.user.rank}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ・{question.created_at}
                          </span>
                        </div>

                        {/* いいね */}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{question.likeCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
