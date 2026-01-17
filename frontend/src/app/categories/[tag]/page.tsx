import Link from "next/link";
import { Heart, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { formatTimeAgo } from "@/lib/utils";

// 表示用の質問型
interface QuestionWithDetails {
  id: string;
  title: string;
  content: string;
  status: "open" | "closed";
  created_at: string;
  answerCount: number;
  likeCount: number;
  tags: string[];
  user: {
    username: string;
    rank: string;
    avatarInitial: string;
  };
}

interface PageProps {
  params: Promise<{ tag: string }>;
}

export default async function CategoryTagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  // 1. タグ名からtag_idを取得
  const { data: tagData, error: tagError } = await supabase
    .from("tags")
    .select("id")
    .eq("name", decodedTag)
    .single();

  if (tagError) {
    console.error("Error fetching tag:", tagError.message);
  }

  let questions: QuestionWithDetails[] = [];

  if (tagData) {
    // 2. question_tags経由で質問を取得
    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select(`
        id,
        title,
        content,
        status,
        created_at,
        profiles:user_id (
          username,
          avatar_url,
          ranks:rank_id (name)
        ),
        question_tags!inner (
          tags (name)
        ),
        likes (id),
        answers (id)
      `)
      .eq("question_tags.tag_id", tagData.id)
      .order("created_at", { ascending: false });

    if (questionsError) {
      console.error("Error fetching questions:", questionsError.message);
    }

    // データを表示用に整形
    questions = (questionsData ?? []).map((q) => {
      const profile = q.profiles as { username: string; avatar_url: string | null; ranks: { name: string } | null } | null;
      const questionTags = q.question_tags as { tags: { name: string } }[];
      const likes = q.likes as { id: string }[];
      const answers = q.answers as { id: string }[];

      return {
        id: q.id,
        title: q.title,
        content: q.content,
        status: q.status as "open" | "closed",
        created_at: formatTimeAgo(q.created_at),
        answerCount: answers?.length ?? 0,
        likeCount: likes?.length ?? 0,
        tags: questionTags?.map((qt) => qt.tags.name) ?? [],
        user: {
          username: profile?.username ?? "unknown",
          rank: profile?.ranks?.name ?? "ビギナー",
          avatarInitial: profile?.username?.charAt(0).toUpperCase() ?? "?",
        },
      };
    });
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
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
      <div className="space-y-4">
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
