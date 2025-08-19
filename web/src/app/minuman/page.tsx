import Link from "next/link";

export default function Minuman() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md p-4">
        <header className="sticky top-0 bg-white py-3 border-b">
          <Link href="/" className="text-sm text-slate-500 hover:underline">← Kembali</Link>
          <h1 className="font-extrabold text-xl mt-1">Minuman</h1>
        </header>

        <section className="mt-6 text-slate-500 text-sm">
          Fitur minuman akan hadir di pembaruan berikutnya.
        </section>

        <footer className="fixed bottom-0 left-0 right-0 border-t bg-white p-3 text-center text-xs text-slate-500">
          &nbsp;
        </footer>
      </div>
    </main>
  );
}
