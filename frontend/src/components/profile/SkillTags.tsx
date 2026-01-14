import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SkillTags() {
  const tags = [
    { name: "React", count: 45 },
    { name: "TypeScript", count: 32 },
    { name: "Node.js", count: 18 },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold mb-4">得意タグ</h3>
        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag.name} className="flex justify-between">
              <Badge variant="secondary">{tag.name}</Badge>
              <span className="text-sm">{tag.count}問</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
