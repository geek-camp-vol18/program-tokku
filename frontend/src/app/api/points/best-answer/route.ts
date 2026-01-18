import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, answerId } = await request.json();

  if (!userId || !answerId) {
    return NextResponse.json({ error: 'User ID and Answer ID are required' }, { status: 400 });
  }

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
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    const currentPoints = profile?.points || 0;
    const newPoints = Math.max(0, currentPoints + 50); // ベストアンサー: +50pt

    // ポイントを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating points:', updateError);
      return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
    }

    console.log(`Points updated for user ${userId}: +50 (best answer) (total: ${newPoints})`);
    return NextResponse.json({ success: true, points: newPoints });
  } catch (error) {
    console.error('Error in best answer points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
