'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminGate from '@/components/AdminGate';
import { supabase } from '@/lib/supabaseClient';
import { slugify } from '@/utils/slugify';

type Tenant = { id: string; name: string; slug: string };

/** "25.000" | "25000" -> 25000 */
function rpToInt(input: string) {
  return parseInt(input.replace(/\./g, '').replace(/[^\d]/g, '') || '0', 10);
}

export default function AdminPage() {
  const router = useRouter();

  // preload tenants for the "Add Item" form select
  const [tenants, setTenants] = useState<Tenant[]>([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id,name,slug')
        .order('name');

      if (!error && data) setTenants(data as Tenant[]);
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  /* ----------------------- Add Tenant ----------------------- */
  const [tName, setTName] = useState('');
  const [tThumb, setTThumb] = useState<File | null>(null);
  const [tOrder, setTOrder] = useState<number>(0);
  const [tActive, setTActive] = useState(true);
  const [tStatus, setTStatus] = useState<string | null>(null);

  async function handleAddTenant(e: React.FormEvent) {
    e.preventDefault();
    setTStatus('Saving…');

    const slug = slugify(tName);
    let thumbUrl: string | null = null;

    if (tThumb) {
      const path = `tenants/${slug}-${Date.now()}-${tThumb.name}`;
      const { error: upErr } = await supabase.storage
        .from('menu-images')
        .upload(path, tThumb, { upsert: true });

      if (upErr) {
        setTStatus(upErr.message);
        return;
      }
      const { data: pub } = supabase.storage.from('menu-images').getPublicUrl(path);
      thumbUrl = pub.publicUrl;
    }

    const { error } = await supabase.from('tenants').insert([
      {
        name: tName,
        slug,
        thumb_url: thumbUrl,
        order_index: tOrder,
        is_active: tActive,
      },
    ]);

    if (error) {
      setTStatus(error.message);
      return;
    }

    setTStatus('Tenant added ✓');
    setTName('');
    setTThumb(null);
    setTOrder(0);
    setTActive(true);

    // refresh tenants for the item form
    const { data } = await supabase.from('tenants').select('id,name,slug').order('name');
    setTenants((data as Tenant[]) || []);
  }

  /* ----------------------- Add Item ----------------------- */
  const [iTenantId, setITenantId] = useState('');
  const [iNameID, setINameID] = useState('');
  const [iNameEN, setINameEN] = useState('');
  const [iPrice, setIPrice] = useState('0');
  const [iDesc, setIDesc] = useState('');
  const [iImage, setIImage] = useState<File | null>(null);
  const [iActive, setIActive] = useState(true);
  const [iStatus, setIStatus] = useState<string | null>(null);

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    setIStatus('Saving…');

    let imageUrl: string | null = null;

    if (iImage) {
      const safeName = slugify(iNameID || 'menu');
      const path = `items/${safeName}-${Date.now()}-${iImage.name}`;
      const { error: upErr } = await supabase.storage
        .from('menu-images')
        .upload(path, iImage, { upsert: true });

      if (upErr) {
        setIStatus(upErr.message);
        return;
      }
      const { data: pub } = supabase.storage.from('menu-images').getPublicUrl(path);
      imageUrl = pub.publicUrl;
    }

    const { error } = await supabase.from('menu_items').insert([
      {
        tenant_id: iTenantId,
        name_id: iNameID,
        name_en: iNameEN,
        price: rpToInt(iPrice),
        description: iDesc || null,
        image_url: imageUrl,
        is_active: iActive,
      },
    ]);

    if (error) {
      setIStatus(error.message);
      return;
    }

    setIStatus('Item added ✓');
    setITenantId('');
    setINameID('');
    setINameEN('');
    setIPrice('0');
    setIDesc('');
    setIImage(null);
    setIActive(true);
  }

  return (
    <AdminGate>
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-md p-4">
          <header className="flex items-center justify-between border-b pb-3">
            <h1 className="font-extrabold text-2xl">Admin</h1>
            <button onClick={logout} className="text-sm underline">
              Sign out
            </button>
          </header>

          {/* Add Tenant */}
          <section className="mt-6">
            <h2 className="font-bold text-lg">Add Tenant</h2>
            <form onSubmit={handleAddTenant} className="space-y-3 mt-2">
              <input
                className="w-full border rounded-xl p-3"
                placeholder="Tenant name"
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                required
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  className="w-32 border rounded-xl p-3"
                  placeholder="Order (0)"
                  value={tOrder}
                  onChange={(e) => setTOrder(parseInt(e.target.value || '0', 10))}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tActive}
                    onChange={(e) => setTActive(e.target.checked)}
                  />
                  Active
                </label>
              </div>
              <div>
                <label className="text-sm block mb-1">Thumbnail (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTThumb(e.target.files?.[0] || null)}
                />
              </div>
              <button className="w-full bg-black text-white rounded-xl p-3">Add Tenant</button>
              {tStatus && <p className="text-xs text-slate-600">{tStatus}</p>}
            </form>
          </section>

          {/* Add Item */}
          <section className="mt-10">
            <h2 className="font-bold text-lg">Add Item</h2>
            <form onSubmit={handleAddItem} className="space-y-3 mt-2">
              <select
                className="w-full border rounded-xl p-3"
                required
                value={iTenantId}
                onChange={(e) => setITenantId(e.target.value)}
              >
                <option value="">Pilih tenant…</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <input
                className="w-full border rounded-xl p-3"
                placeholder="Nama menu (ID)"
                value={iNameID}
                onChange={(e) => setINameID(e.target.value)}
                required
              />
              <input
                className="w-full border rounded-xl p-3"
                placeholder="Menu name (EN)"
                value={iNameEN}
                onChange={(e) => setINameEN(e.target.value)}
                required
              />
              <input
                className="w-full border rounded-xl p-3"
                placeholder="Harga (contoh: 25.000)"
                value={iPrice}
                onChange={(e) => setIPrice(e.target.value)}
                required
              />
              <textarea
                className="w-full border rounded-xl p-3"
                placeholder="Deskripsi (opsional)"
                value={iDesc}
                onChange={(e) => setIDesc(e.target.value)}
              />

              <div>
                <label className="text-sm block mb-1">Foto (opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIImage(e.target.files?.[0] || null)}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={iActive}
                  onChange={(e) => setIActive(e.target.checked)}
                />
                Active
              </label>

              <button className="w-full bg-black text-white rounded-xl p-3">Add Item</button>
              {iStatus && <p className="text-xs text-slate-600">{iStatus}</p>}
            </form>
          </section>

          <footer className="h-12" />
        </div>
      </main>
    </AdminGate>
  );
}
