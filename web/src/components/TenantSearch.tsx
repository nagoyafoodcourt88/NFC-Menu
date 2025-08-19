'use client';

import { useMemo, useState } from 'react';

export type Item = {
  id: string;
  name_id: string;
  name_en: string;
  price: number;
  image_url: string | null;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  thumb_url: string | null;
  order_index: number | null;
  items: Item[];
};

function rp(n: number) {
  return 'Rp ' + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function TenantSearch({ initialTenants }: { initialTenants: Tenant[] }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return initialTenants;
    return initialTenants.filter(t =>
      t.items.some(it =>
        (it.name_id?.toLowerCase() || '').includes(query) ||
        (it.name_en?.toLowerCase() || '').includes(query)
      )
    );
  }, [q, initialTenants]);

  return (
    <div>
      {/* sticky search */}
      <div className="sticky top-14 z-10 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-md p-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border p-3"
            placeholder="Cari menu… (contoh: ayam, mie, sate)"
            autoFocus
          />
          <p className="mt-2 text-xs text-slate-500">
            {filtered.length} tenant cocok
          </p>
        </div>
      </div>

      {/* list */}
      <div className="mx-auto max-w-md p-4 grid gap-3">
        {filtered.map((t) => (
          <article key={t.id} className="flex items-center gap-3 border rounded-2xl p-3 shadow-sm">
            <img
              src={t.thumb_url ?? 'https://picsum.photos/seed/tenant/96/96'}
              alt={t.name}
              className="h-16 w-16 rounded-xl object-cover bg-red-600/10"
            />
            <div className="flex-1">
              <div className="font-bold">{t.name}</div>
              <div className="text-xs text-slate-500">{t.items.length} menu</div>
              {/* preview first item & price */}
              {t.items[0] && (
                <div className="mt-1 text-xs">
                  {t.items[0].name_id} • <span className="font-semibold text-red-700">{rp(t.items[0].price)}</span>
                </div>
              )}
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className="text-sm text-slate-500">Tidak ada hasil untuk “{q}”.</div>
        )}
      </div>
    </div>
  );
}
