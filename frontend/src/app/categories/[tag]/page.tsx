import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiPython, SiJavascript, SiReact, SiTypescript, SiNextdotjs, SiNodedotjs, SiHtml5, SiCss3, SiGit } from "react-icons/si";
import { Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// タグとアイコンのマッピング
const tagIcons: Record<string, React.ReactNode> = {
  "Python": <SiPython className="w-8 h-8 text-[#3776AB]" />,
  "JavaScript": <SiJavascript className="w-8 h-8 text-[#F7DF1E]" />,
  "React": <SiReact className="w-8 h-8 text-[#61DAFB]" />,
  "TypeScript": <SiTypescript className="w-8 h-8 text-[#3178C6]" />,
  "Next.js": <SiNextdotjs className="w-8 h-8 text-foreground" />,
  "Node.js": <SiNodedotjs className="w-8 h-8 text-[#339933]" />,
  "HTML": <SiHtml5 className="w-8 h-8 text-[#E34F26]" />,
  "CSS": <SiCss3 className="w-8 h-8 text-[#1572B6]" />,
  "Git": <SiGit className="w-8 h-8 text-[#F05032]" />,
};

const DefaultIcon = () => <Code className="w-8 h-8 text-muted-foreground" />;

// TODO: Supabaseから質問一覧を取得する
// 現在はモックデータを使用
const mockQuestions = [
  {
    id: "1",
    title: "Reactでstateが更新されません",
    status: "open" as const,
    created_at: "2024-01-16T12:00:00Z",
    user: { username: "田中太郎" },
  },
  {
    id: "2",
    title: "useEffectの依存配列について",
    status: "closed" as const,
    created_at: "2024-01-15T10:00:00Z",
    user: { username: "山田花子" },
  },
  {
    id: "3",
    title: "コンポーネントの再レンダリングを防ぎたい",
    status: "open" as const,
    created_at: "2024-01-14T08:00:00Z",
    user: { username: "佐藤一郎" },
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
    <div className="container mx-auto px-4 py-8">
      {/* 戻るボタン */}
      <Link href="/categories">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          カテゴリ一覧に戻る
        </Button>
      </Link>

      {/* タグ情報 */}
      <div className="flex items-center gap-4 mb-8">
        {tagIcons[decodedTag] || <DefaultIcon />}
        <div>
          <h1 className="text-2xl font-bold">{decodedTag}</h1>
          <p className="text-muted-foreground">{questions.length}件の質問</p>
        </div>
      </div>

      {/* 質問一覧 */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            このカテゴリの質問はまだありません
          </p>
        ) : (
          questions.map((question) => (
            <Link key={question.id} href={`/questions/${question.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={question.status === "open" ? "default" : "secondary"}>
                      {question.status === "open" ? "募集中" : "解決済み"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{question.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {question.user.username} • {new Date(question.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
