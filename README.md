# Pocapoco（犬のマッサージ予約サイト）

Next.js で作ったシンプルな予約サイトです。

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

## ローカル起動

```bash
npm install
npm run dev
```

## Cloudflare へのデプロイについて

この版は予約データを `data/reservations.json`（ローカルファイル）に保存します。

- ローカル開発ではそのまま動きます
- Cloudflare 本番運用では永続化のため **D1 / KV への置き換え** が必要です

次ステップで D1 対応を追加すれば、そのまま Cloudflare Pages/Workers に載せられます。
