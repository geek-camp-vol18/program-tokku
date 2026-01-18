import { createClient } from '@supabase/supabase-js';

// ポイント更新関数
export async function addPoints(userId: string, points: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 現在のポイントを取得
    const { data: profile, error: selectError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (selectError) {
      console.error('Error fetching current points:', selectError);
      return false;
    }

    const currentPoints = profile?.points || 0;
    const newPoints = Math.max(0, currentPoints + points); // ポイントがマイナスにならないようにする

    // ポイントを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating points:', updateError);
      return false;
    }

    console.log(`Points updated for user ${userId}: +${points} (total: ${newPoints})`);
    return true;
  } catch (error) {
    console.error('Error in addPoints:', error);
    return false;
  }
}

// ポイント定数
export const POINTS = {
  QUESTION: 5,      // 質問を投稿: +5pt
  ANSWER: 10,       // 回答を投稿: +10pt
  BEST_ANSWER: 50,  // ベストアンサー: +50pt
  LIKE: 2,          // いいねを受ける: +2pt
};
