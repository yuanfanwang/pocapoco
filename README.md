# Pocapoco（犬のマッサージ予約サイト）

Next.js で作ったシンプルな予約サイトです。  
Cloudflare デプロイ前提で、予約データは D1 を使えます（ローカルでは JSON ファイル保存で動作）。

## ページ構成

- `/` トップページ（犬の写真・料金体系）
- `/reserve` 予約フォーム
- `/admin/login` 管理者ログイン
- `/admin` 管理者画面（予約一覧・ステータス更新）

## 管理者パスワード

環境変数 `ADMIN_PASSWORD` を使います。  
未設定時は `pocapoco_lin1013` を使います。

`.env.local` 例:

```bash
ADMIN_PASSWORD=pocapoco_lin1013
```

---

## ローカル起動

```bash
npm install
npm run dev
```

- ローカルでは `data/reservations.json` に予約が保存されます
- 管理者画面: `http://localhost:3000/admin`

---

## Cloudflare デプロイ（独自ドメイン不要）

### 1) Cloudflare にログイン

```bash
npx wrangler login
```

### 2) D1 データベース作成

```bash
npx wrangler d1 create pocapoco-db
```

出力される `database_id` を `wrangler.toml` の以下に反映:

```toml
[[d1_databases]]
binding = "DB"
database_name = "pocapoco-db"
database_id = "ここを置き換え"
```

### 3) マイグレーション実行

```bash
npm run d1:migrate:remote
```

### 4) 管理者パスワードを Secret 登録（推奨）

```bash
npx wrangler secret put ADMIN_PASSWORD
```

### 5) デプロイ

```bash
npm run cf:deploy
```

デプロイ後、`*.workers.dev` URL が発行されます（独自ドメインなしで運用可）。

---

## 補足

- Cloudflare 上では D1 が使われます
- D1 未設定環境では自動的に JSON ファイル保存にフォールバックします
