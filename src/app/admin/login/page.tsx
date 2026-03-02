import { login, isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;

  async function doLogin(formData: FormData) {
    "use server";
    const password = String(formData.get("password") || "");
    const ok = await login(password);
    if (!ok) {
      redirect("/admin/login?error=1");
    }
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <form action={doLogin} className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-xl font-bold">管理者ログイン</h1>
        {params.error === "1" && (
          <p className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">パスワードが違います</p>
        )}
        <input
          type="password"
          name="password"
          placeholder="パスワード"
          required
          className="mb-4 w-full rounded border px-3 py-2"
        />
        <button className="w-full rounded bg-zinc-900 py-2 font-semibold text-white">ログイン</button>
      </form>
    </main>
  );
}
