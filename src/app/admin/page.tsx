import { isAdminAuthenticated, logout } from "@/lib/admin-auth";
import { listReservations, updateReservationStatus } from "@/lib/reservations";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const statuses = [
  { label: "新規", value: "new" },
  { label: "対応中", value: "in_progress" },
  { label: "完了", value: "done" },
  { label: "キャンセル", value: "canceled" },
] as const;

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const reservations = await listReservations();

  async function updateStatus(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const status = String(formData.get("status") || "new");

    if (["new", "in_progress", "done", "canceled"].includes(status)) {
      await updateReservationStatus(id, status as "new" | "in_progress" | "done" | "canceled");
      revalidatePath("/admin");
    }
  }

  async function doLogout() {
    "use server";
    await logout();
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">管理者画面（予約一覧）</h1>
          <form action={doLogout}>
            <button className="rounded border border-zinc-300 px-3 py-1 text-sm">ログアウト</button>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-700">
              <tr>
                <th className="px-3 py-2">受付日時</th>
                <th className="px-3 py-2">飼い主</th>
                <th className="px-3 py-2">連絡先</th>
                <th className="px-3 py-2">犬</th>
                <th className="px-3 py-2">希望日時</th>
                <th className="px-3 py-2">プラン</th>
                <th className="px-3 py-2">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-t border-zinc-100 align-top">
                  <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString("ja-JP")}</td>
                  <td className="px-3 py-2">{r.ownerName}</td>
                  <td className="px-3 py-2">{r.contact}</td>
                  <td className="px-3 py-2">
                    {r.dogName}
                    {r.dogBreed ? <div className="text-zinc-500">{r.dogBreed}</div> : null}
                  </td>
                  <td className="px-3 py-2">{r.desiredAt}</td>
                  <td className="px-3 py-2">{r.plan}</td>
                  <td className="px-3 py-2">
                    <form action={updateStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={r.id} />
                      <select name="status" defaultValue={r.status} className="rounded border px-2 py-1">
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <button className="rounded bg-zinc-900 px-2 py-1 text-white">更新</button>
                    </form>
                    {r.notes ? <p className="mt-1 text-xs text-zinc-500">備考: {r.notes}</p> : null}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-zinc-500">
                    まだ予約はありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
