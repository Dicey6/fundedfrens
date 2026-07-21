import { useState, useEffect } from 'react';
import { supabase, Challenge } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useChallenge() {
  const { profile, user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChallenge = async () => {
    if (!user || !profile?.active_challenge_id) { setChallenge(null); setLoading(false); return; }
    const { data } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', profile.active_challenge_id)
      .single();
    setChallenge((data as Challenge) ?? null);
    setLoading(false);
  };

  useEffect(() => { fetchChallenge(); }, [profile?.active_challenge_id, user?.id]);
  return { challenge, loading, refresh: fetchChallenge };
}
