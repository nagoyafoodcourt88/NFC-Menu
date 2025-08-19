import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const metadata = {
  robots: { index: false, follow: false }, // keep admin pages out of search
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  // 1) must be logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/admin/login");

  // 2) must be admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/admin/login");

  return <>{children}</>;
}
