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
    console.log('userId:', userId);
    
    // 1. 基本的な統計を並列で取得（countオプションのみを使用）
    const [questionsResponse, answersResponse, solvedResponse, likesResponse, badgesResponse, tagsResponse] = await Promise.all([
      // ユーザーが投稿した質問数
      supabase.from('questions').select('id', { count: 'exact' }).eq('user_id', userId),
      
      // ユーザーが回答した総数
      supabase.from('answers').select('id', { count: 'exact' }).eq('user_id', userId),
      
      // ユーザーのベストアンサー数
      supabase.from('answers').select('id', { count: 'exact' }).eq('user_id', userId).eq('is_best_answer', true),
      
      // ユーザーが受け取ったいいね数
      supabase.from('likes').select('id', { count: 'exact' }).eq('user_id', userId),
      
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

    console.log('questionsResponse:', questionsResponse);
    console.log('answersResponse:', answersResponse);
    console.log('solvedResponse:', solvedResponse);
    console.log('likesResponse:', likesResponse);
    console.log('badgesResponse:', badgesResponse);

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

    // 5. ポイント計算
    const questionCount = questionsResponse.count || 0;
    const answeredCount = answersResponse.count || 0;
    const solvedCount = solvedResponse.count || 0;
    const likedCount = likesResponse.count || 0;

    const totalPoints = 
      (questionCount * 5) +      // 質問: +5pt
      (answeredCount * 10) +     // 回答: +10pt
      (solvedCount * 50) +       // ベストアンサー: +50pt
      (likedCount * 2);          // いいね: +2pt

    // 6. DBのpointsカラムを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: totalPoints })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating points:', updateError);
    }

    // 7. レスポンスを返す
    return NextResponse.json({
      question_count: questionCount,
      answered_count: answeredCount,
      solved_count: solvedCount,
      liked_count: likedCount,
      points: totalPoints,
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
