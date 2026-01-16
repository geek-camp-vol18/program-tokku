import Link from "next/link";
import { SiPython, SiJavascript, SiReact, SiTypescript, SiNextdotjs, SiNodedotjs, SiHtml5, SiCss3, SiGit } from "react-icons/si";
import { Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// タグとアイコンのマッピング
const tagIcons: Record<string, React.ReactNode> = {
  "Python": <SiPython className="w-10 h-10 text-[#3776AB]" />,
  "JavaScript": <SiJavascript className="w-10 h-10 text-[#F7DF1E]" />,
  "React": <SiReact className="w-10 h-10 text-[#61DAFB]" />,
  "TypeScript": <SiTypescript className="w-10 h-10 text-[#3178C6]" />,
  "Next.js": <SiNextdotjs className="w-10 h-10 text-foreground" />,
  "Node.js": <SiNodedotjs className="w-10 h-10 text-[#339933]" />,
  "HTML": <SiHtml5 className="w-10 h-10 text-[#E34F26]" />,
  "CSS": <SiCss3 className="w-10 h-10 text-[#1572B6]" />,
  "Git": <SiGit className="w-10 h-10 text-[#F05032]" />,
};

// デフォルトアイコン（マッピングにないタグ用）
const DefaultIcon = () => <Code className="w-10 h-10 text-muted-foreground" />;

// TODO: Supabaseからタグ一覧を取得する
// 現在はモックデータを使用
const tags = [
  { id: "1", name: "Python" },
  { id: "2", name: "JavaScript" },
  { id: "3", name: "React" },
  { id: "4", name: "TypeScript" },
  { id: "5", name: "Next.js" },
  { id: "6", name: "Node.js" },
  { id: "7", name: "HTML" },
  { id: "8", name: "CSS" },
  { id: "9", name: "Git" },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">カテゴリから探す</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/categories/${tag.name}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                {tagIcons[tag.name] || <DefaultIcon />}
                <span className="font-medium text-sm">{tag.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
