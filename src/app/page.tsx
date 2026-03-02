import Image from "next/image";
import Link from "next/link";

const plans = [
  { name: "おためし", duration: "30分", price: "¥3,000" },
  { name: "スタンダード", duration: "60分", price: "¥5,500" },
  { name: "しっかりケア", duration: "90分", price: "¥7,800" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50 text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <h1 className="text-4xl font-bold">Pocapoco 犬のマッサージ</h1>
            <p className="text-lg text-zinc-700">
              わんちゃんの体調に合わせたやさしいマッサージ。リラックスとコンディション維持をお手伝いします。
            </p>
            <div className="flex gap-3">
              <Link
                href="/reserve"
                className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
              >
                予約する
              </Link>
              <Link
                href="/admin"
                className="rounded-lg border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-100"
              >
                管理者画面
              </Link>
            </div>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80"
            alt="犬の写真"
            width={1200}
            height={800}
            className="h-80 w-full rounded-2xl object-cover shadow-lg"
            priority
          />
        </section>

        <section className="mt-14 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">料金体系</h2>
          <ul className="space-y-3">
            {plans.map((plan) => (
              <li
                key={plan.name}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
              >
                <span className="font-semibold">{plan.name}</span>
                <span className="text-zinc-600">{plan.duration}</span>
                <span className="font-bold">{plan.price}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
