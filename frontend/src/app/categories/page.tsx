import Link from "next/link";
import { SiPython, SiJavascript, SiReact, SiTypescript, SiNextdotjs, SiNodedotjs, SiVuedotjs, SiGo, SiRuby, SiPhp, SiRust } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// タグとアイコンのマッピング
const tagIcons: Record<string, React.ReactNode> = {
  "Python": <SiPython className="w-10 h-10 text-[#3776AB]" />,
  "JavaScript": <span className="text-2xl font-bold text-[#F7DF1E]">JS</span>,
  "React": <SiReact className="w-10 h-10 text-[#61DAFB]" />,
  "TypeScript": <span className="text-2xl font-bold text-[#3178C6]">TS</span>,
  "Next.js": <SiNextdotjs className="w-10 h-10 text-foreground" />,
  "Node.js": <SiNodedotjs className="w-10 h-10 text-[#339933]" />,
  "Vue": <SiVuedotjs className="w-10 h-10 text-[#4FC08D]" />,
  "Go": <SiGo className="w-10 h-10 text-[#00ADD8]" />,
  "Java": <FaJava className="w-10 h-10 text-[#ED8B00]" />,
  "Ruby": <SiRuby className="w-10 h-10 text-[#CC342D]" />,
  "PHP": <SiPhp className="w-10 h-10 text-[#777BB4]" />,
  "Rust": <SiRust className="w-10 h-10 text-[#DEA584]" />,
};

// TODO: Supabaseからタグ一覧を取得する
const tags = [
  { id: "1", name: "Python", questionCount: 234, trend: 12 },
  { id: "2", name: "JavaScript", questionCount: 189, trend: 8 },
  { id: "3", name: "React", questionCount: 156, trend: 15 },
  { id: "4", name: "TypeScript", questionCount: 98, trend: 22 },
  { id: "5", name: "Node.js", questionCount: 87, trend: 5 },
  { id: "6", name: "Vue", questionCount: 45, trend: 3 },
  { id: "7", name: "Next.js", questionCount: 67, trend: 18 },
  { id: "8", name: "Go", questionCount: 34, trend: 10 },
  { id: "9", name: "Java", questionCount: 56, trend: -2 },
  { id: "10", name: "Ruby", questionCount: 23, trend: 1 },
  { id: "11", name: "PHP", questionCount: 45, trend: -5 },
  { id: "12", name: "Rust", questionCount: 28, trend: 25 },
];

// トレンドカテゴリ（上位5件）
const trendingTags = [...tags].sort((a, b) => b.trend - a.trend).slice(0, 5);

export default function CategoriesPage() {
  return (
    <div className="px-6 py-8 max-w-6xl">
      <div className="flex gap-8">
        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">カテゴリ</h1>
            <p className="text-muted-foreground">言語やトピックから質問を探す</p>
          </div>

          {/* 言語・フレームワーク */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">言語・フレームワーク</h2>
              <Badge variant="secondary" className="rounded-full">
                {tags.length}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tags.map((tag) => (
                <Link key={tag.id} href={`/categories/${tag.name}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                          {tagIcons[tag.name]}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${tag.trend >= 0 ? "text-primary" : "text-destructive"}`}
                        >
                          {tag.trend >= 0 ? "+" : ""}{tag.trend}%
                        </Badge>
                      </div>
                      <div>
                        <p className="font-semibold">{tag.name}</p>
                        <p className="text-sm text-muted-foreground">{tag.questionCount}件の質問</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 右サイドバー */}
        <div className="hidden lg:block w-72">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">トレンドカテゴリ</h3>
              </div>
              <div className="space-y-3">
                {trendingTags.map((tag, index) => (
                  <Link
                    key={tag.id}
                    href={`/categories/${tag.name}`}
                    className="flex items-center justify-between hover:bg-muted/50 rounded-md p-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-primary w-4">
                        {index + 1}
                      </span>
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs text-primary"
                    >
                      +{tag.trend}%
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
