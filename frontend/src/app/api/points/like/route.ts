import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, isAdding } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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
    const pointDelta = isAdding ? 2 : -2; // いいね: +2pt または -2pt
    const newPoints = Math.max(0, currentPoints + pointDelta);

    // ポイントを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating points:', updateError);
      return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
    }

    console.log(`Points updated for user ${userId}: ${isAdding ? '+' : ''}${pointDelta} (like) (total: ${newPoints})`);
    return NextResponse.json({ success: true, points: newPoints });
  } catch (error) {
    console.error('Error in like points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
