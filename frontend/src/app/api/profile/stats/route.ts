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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 1. 基本的な統計とバッジ、および「ベストアンサーに紐づく全タグ」を並列で取得
    const [likesResponse, bestAnswersResponse, badgesResponse, tagsResponse] = await Promise.all([
      // 総いいね数
      supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      
      // 総ベストアンサー数
      supabase.from('answers').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_best_answer', true),
      
      // バッジ一覧
      supabase.from('user_badges').select('badge_id, badges(id, name)').eq('user_id', userId),

      // ベストアンサーに関連する全てのタグ情報を取得
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
      console.error('Tags fetch error:', tagsResponse.error);
      return NextResponse.json({ error: tagsResponse.error.message }, { status: 500 });
    }

    // 2. 取得したデータをタグごとに集計
    const tagCounts: Record<string, number> = {};
    
    tagsResponse.data.forEach((answer: any) => {
      // 質問に紐づくタグをループ
      answer.questions.question_tags.forEach((questionTag: any) => {
        const tagName = questionTag.tags.name;
        tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
      });
    });

    // 3. タグをカウント数でソートして、{name, count}形式に変換
    const tag_stats = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 4. バッジ情報を整形
    const badges = badgesResponse.data?.map((ub: any) => ({
      id: ub.badge_id,
      name: ub.badges.name,
      acquired: true
    })) || [];

    // 5. レスポンスを返す
    return NextResponse.json({
      liked_count: likesResponse.count || 0,
      best_answer_count: bestAnswersResponse.count || 0,
      badges: badges,
      tag_stats: tag_stats
    });

  } catch (error: any) {
    console.error('Error in profile/stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}
