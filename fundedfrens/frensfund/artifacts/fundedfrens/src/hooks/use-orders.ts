import { useState, useEffect } from 'react';
import { supabase, Order } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) { setOrders([]); setLoading(false); return; }
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user?.id]);
  return { orders, loading, refresh: fetchOrders };
}
