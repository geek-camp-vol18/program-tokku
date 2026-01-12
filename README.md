# プログラム特区

プログラミングの疑問を解決するQ&Aプラットフォーム

## 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | Next.js 14 (TypeScript) |
| バックエンド | Node.js + Express (TypeScript) |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth |
| コンテナ | Docker / Docker Compose |
| デプロイ | Vercel (frontend) / Supabase (DB) |

## ディレクトリ構成

```
program-tokku/
├── docker-compose.yml      # Docker構成ファイル
├── .env.example            # 環境変数テンプレート
├── frontend/               # フロントエンド (Next.js)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/            # App Router
│       ├── components/     # UIコンポーネント
│       └── lib/
│           └── supabase.ts # Supabaseクライアント
└── backend/                # バックエンド (Express)
    ├── Dockerfile
    ├── package.json
    └── src/
        └── index.ts        # エントリーポイント
```

---

## 環境構築手順

### 前提条件

以下がインストールされていることを確認してください。

- **Docker Desktop**
  - Mac: https://docs.docker.com/desktop/install/mac-install/
  - Windows: https://docs.docker.com/desktop/install/windows-install/

- **Git**
  - https://git-scm.com/downloads

#### インストール確認コマンド

```bash
# Dockerの確認
docker --version

# Docker Composeの確認
docker-compose --version

# Gitの確認
git --version
```

---

### Step 1: リポジトリをクローン

```bash
git clone <リポジトリURL>
cd program-tokku
```

---

### Step 2: Supabaseプロジェクトを作成

> **注意**: チームで1つのプロジェクトを共有します。最初の1人が作成してください。

1. https://supabase.com にアクセス
2. GitHubでログイン
3. 「New Project」をクリック
4. 以下を入力:
   - **Name**: `program-tokku`
   - **Database Password**: 安全なパスワード（メモしておく）
   - **Region**: `Northeast Asia (Tokyo)`
5. 「Create new project」をクリック

---

### Step 3: Supabaseの接続情報を取得

プロジェクト作成後、以下の情報を取得:

#### API設定（Settings → API）
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Database設定（Settings → Database）
- `Connection string` → `DATABASE_URL`
  - `[YOUR-PASSWORD]` を作成時のパスワードに置き換える

---

### Step 4: 環境変数ファイルを作成

```bash
cp .env.example .env
```

`.env` を編集して、Step 3で取得した値を設定:

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres

# ポート設定
BACKEND_PORT=3001
FRONTEND_PORT=3000
```

---

### Step 5: Supabaseパッケージをインストール

```bash
cd frontend
npm install @supabase/supabase-js
cd ..
```

---

### Step 6: Dockerコンテナを起動

```bash
docker-compose up --build
```

以下のログが表示されれば起動成功:

```
program-tokku-backend  | Server is running on port 3001
program-tokku-frontend | ▲ Next.js 14.x.x
program-tokku-frontend |   - Local: http://localhost:3000
```

---

### Step 7: 動作確認

| サービス | URL |
|----------|-----|
| フロントエンド | http://localhost:3000 |
| バックエンドAPI | http://localhost:3001/health |
| Supabaseダッシュボード | https://supabase.com/dashboard |

---

## よく使うコマンド

### コンテナの起動・停止

```bash
# 起動（バックグラウンド）
docker-compose up -d

# 起動（ログを表示しながら）
docker-compose up

# 停止
docker-compose down

# 再ビルド（パッケージ追加後など）
docker-compose up --build
```

### ログの確認

```bash
# 全サービスのログ
docker-compose logs

# 特定サービスのログ
docker-compose logs frontend
docker-compose logs backend

# リアルタイムでログを監視
docker-compose logs -f
```

### コンテナ内でコマンド実行

```bash
# フロントエンドでnpmコマンド実行
docker-compose exec frontend npm install <パッケージ名>

# バックエンドでnpmコマンド実行
docker-compose exec backend npm install <パッケージ名>
```

---

## Supabaseの使い方

### データベースにテーブルを作成

Supabaseダッシュボード → Table Editor → New Table

### フロントエンドからデータを取得

```typescript
import { supabase } from "@/lib/supabase";

// データ取得
const { data, error } = await supabase
  .from("questions")
  .select("*");

// データ挿入
const { error } = await supabase
  .from("questions")
  .insert({ title: "質問タイトル", content: "質問内容" });
```

### 認証（Supabase Auth）

```typescript
import { supabase } from "@/lib/supabase";

// サインアップ
await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
});

// ログイン
await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password",
});

// ログアウト
await supabase.auth.signOut();
```

---

## トラブルシューティング

### ポートが既に使用されている

```bash
# .envでポートを変更
BACKEND_PORT=4001
FRONTEND_PORT=4000
```

### Supabaseに接続できない

1. `.env` の値が正しいか確認
2. Supabaseダッシュボードでプロジェクトがアクティブか確認
3. VPNを使っている場合は一時的にオフにする

### node_modulesの不整合

```bash
docker-compose down
docker volume prune
docker-compose up --build
```

---

## 開発フロー

1. 新しいブランチを作成
   ```bash
   git checkout -b feature/機能名
   ```

2. Dockerを起動して開発
   ```bash
   docker-compose up
   ```

3. コードを変更（ホットリロードで自動反映）

4. 変更をコミット・プッシュ
   ```bash
   git add .
   git commit -m "機能の説明"
   git push origin feature/機能名
   ```

5. プルリクエストを作成

---

## ポート一覧

| サービス | ポート |
|----------|--------|
| フロントエンド (Next.js) | 3000 |
| バックエンド (Express) | 3001 |
