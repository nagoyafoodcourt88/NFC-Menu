import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const metadata = {
  robots: { index: false, follow: false }, // noindex /admin
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/admin/login");

  return <>{children}</>;
}
