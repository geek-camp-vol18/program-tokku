import { Card, CardContent } from "@/components/ui/card";

export function PointHistory() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold mb-4">⚡ ポイント獲得履歴</h3>

        <ul className="space-y-4">
          <li className="flex justify-between">
            <div>
              <p className="font-medium">
                useEffectの質問でベストアンサー獲得
              </p>
              <p className="text-xs text-muted-foreground">2時間前</p>
            </div>
            <span className="text-emerald-600 font-bold">+50pt</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
