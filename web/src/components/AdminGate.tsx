'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type Props = { children: React.ReactNode };

export default function AdminGate({ children }: Props) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      // 1) must be logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
        return;
      }

      // 2) must be admin (RLS lets user read own profile)
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('profiles read error:', error);
        router.replace('/admin/login');
        return;
      }

      if (!data?.is_admin) {
        router.replace('/'); // logged in but not admin -> kick to home
        return;
      }

      setOk(true);
    })();
  }, [router]);

  if (ok) return <>{children}</>;
  return <div className="p-6 text-center text-sm text-slate-600">Checking access…</div>;
}
