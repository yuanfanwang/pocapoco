import Link from "next/link";

const plans = ["30分コース", "60分コース", "90分コース"];

export default async function ReservePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const success = params.success === "1";

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">予約フォーム</h1>
          <Link href="/" className="text-sm text-emerald-700 hover:underline">
            ← トップへ戻る
          </Link>
        </div>

        {success && (
          <p className="mb-4 rounded-lg bg-emerald-100 px-3 py-2 text-emerald-800">
            予約を受け付けました。ありがとうございます！
          </p>
        )}

        <form action="/api/reservations" method="post" className="space-y-4">
          <input name="ownerName" required placeholder="飼い主さまのお名前" className="w-full rounded border px-3 py-2" />
          <input name="contact" required placeholder="連絡先（メール or 電話）" className="w-full rounded border px-3 py-2" />
          <input name="dogName" required placeholder="わんちゃんのお名前" className="w-full rounded border px-3 py-2" />
          <input name="dogBreed" placeholder="犬種（任意）" className="w-full rounded border px-3 py-2" />
          <input name="desiredAt" required type="datetime-local" className="w-full rounded border px-3 py-2" />
          <select name="plan" required className="w-full rounded border px-3 py-2">
            <option value="">コースを選択してください</option>
            {plans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <textarea name="notes" placeholder="備考（任意）" className="min-h-24 w-full rounded border px-3 py-2" />

          <button type="submit" className="w-full rounded bg-emerald-700 py-2 font-semibold text-white hover:bg-emerald-800">
            予約を送信
          </button>
        </form>
      </div>
    </main>
  );
}
