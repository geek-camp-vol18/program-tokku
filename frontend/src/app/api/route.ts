import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // SERVICE_ROLEの代わりにANONを使う
);

  // 1. 基本的な統計とバッジ、および「ベストアンサーに紐づく全タグ」を並列で取得
  const [likes, bestAnswers, badges, tagsResponse] = await Promise.all([
    // 総いいね数
    supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    
    // 総ベストアンサー数
    supabase.from('answers').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_best_answer', true),
    
    // バッジ一覧
    supabase.from('user_badges').select('badge_id, badges(name)').eq('user_id', userId),

    // ベストアンサーに関連する全てのタグ情報を取得（フィルタリングせず全部取る）
    supabase
      .from('answers')
      .select(`
        questions!inner (
          question_tags!inner (
            tags!inner (name)
          )
        )
      `)
      .eq('user_id', userId)
      .eq('is_best_answer', true)
  ]);

  if (tagsResponse.error) {
    return NextResponse.json({ error: tagsResponse.error.message }, { status: 500 });
  }

  // 2. 取得したデータをタグごとに集計
  const tagCounts: Record<string, number> = {};
  
  tagsResponse.data.forEach((answer: any) => {
    // 質問に紐づくタグをループ
    answer.questions?.question_tags?.forEach((qt: any) => {
      const tagName = qt.tags.name;
      tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
    });
  });

  // 3. 配列形式に変換（数が多い順）
  const sortedTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 4. 全てのデータをまとめて返却
  return NextResponse.json({
    liked_count: likes.count || 0,
    best_answer_count: bestAnswers.count || 0,
    badges: badges.data || [],
    tag_stats: sortedTags // ここに集計したタグデータを入れる！
  });
}


