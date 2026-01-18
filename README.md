# プログラム特区

プログラミングの疑問を解決するQ&Aプラットフォーム

## 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | Next.js (TypeScript) + Tailwind CSS + shadcn/ui |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth |
| ストレージ | Supabase Storage |
| コンテナ | Docker / Docker Compose |
| デプロイ | Vercel (frontend) / Supabase (DB) |

## ディレクトリ構成

```
program-tokku/
├── docker-compose.yml
├── .env.example
└── frontend/
    └── src/
        ├── app/                      # ページ
        │   ├── layout.tsx            # 共通レイアウト
        │   ├── page.tsx              # ホーム（質問一覧）
        │   ├── (auth)/               # 認証
        │   │   ├── login/
        │   │   ├── signup/
        │   │   └── reset-password/
        │   ├── questions/            # 質問
        │   │   ├── [id]/             # 質問詳細
        │   │   └── new/              # 質問投稿
        │   ├── categories/           # カテゴリ
        │   │   └── [tag]/            # カテゴリ別一覧
        │   └── profile/              # プロフィール
        │
        ├── components/
        │   ├── ui/                   # shadcn/ui
        │   ├── layout/               # Header, Sidebar等
        │   ├── questions/            # 質問関連
        │   ├── auth/                 # 認証関連
        │   ├── profile/              # プロフィール関連
        │   ├── points/               # ポイント・ランク・モーダル
        │   ├── common/               # 共通（タグ、いいね等）
        │   └── features/             # 特徴説明
        │
        ├── hooks/                    # カスタムフック
        ├── lib/                      # Supabase等
        ├── types/                    # 型定義
        └── constants/                # 定数（ポイント、ランク等）
```

---

## 環境構築手順

### 前提条件

- **Docker Desktop** がインストールされていること
- **Git** がインストールされていること

```bash
# 確認コマンド
docker --version
git --version
```

---

### Step 1: リポジトリをクローン

```bash
git clone <リポジトリURL>
cd program-tokku
```

---

### Step 2: Supabaseプロジェクトに参加

プロジェクト管理者から **Supabaseプロジェクトへの招待** を受けてください。

1. 招待メールのリンクをクリック
2. https://supabase.com にGitHubでログイン
3. `program-tokku` プロジェクトが表示されることを確認

---

### Step 3: 接続情報を確認

Supabaseダッシュボードから接続情報を取得：

1. **Project URL**
   - Settings → General → Project ID をコピー
   - `https://[PROJECT_ID].supabase.co` の形式で使用

2. **API Key**
   - Settings → API Keys → **Publishable key (default)** をコピー

---

### Step 4: 環境変数ファイルを作成

```bash
cp .env.example .env
```

`.env` を編集:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
FRONTEND_PORT=3000
```

---

### Step 5: Dockerコンテナを起動

```bash
docker-compose up --build
```

以下のログが表示されれば成功:

```
program-tokku-frontend | ▲ Next.js
program-tokku-frontend |   - Local: http://localhost:3000
```

---

### Step 6: 動作確認

| URL | 説明 |
|-----|------|
| http://localhost:3000 | アプリ |
| https://supabase.com/dashboard | Supabaseダッシュボード |

---

## よく使うコマンド

```bash
# 起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d

# 停止
docker-compose down

# 再ビルド（パッケージ追加後）
docker-compose up --build

# ログ確認
docker-compose logs -f

# パッケージ追加
docker-compose exec frontend npm install <パッケージ名>
```

---

## Supabaseの使い方

### データ取得

```typescript
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase
  .from("questions")
  .select("*");
```

### データ挿入

```typescript
const { error } = await supabase
  .from("questions")
  .insert({ title: "質問タイトル", content: "質問内容" });
```

### 認証

```typescript
// サインアップ
await supabase.auth.signUp({ email, password });

// ログイン
await supabase.auth.signInWithPassword({ email, password });

// ログアウト
await supabase.auth.signOut();

// 現在のユーザー取得
const { data: { user } } = await supabase.auth.getUser();
```

---

## トラブルシューティング

### ポートが使用中

`.env` でポートを変更:
```env
FRONTEND_PORT=4000
```

### パッケージの不整合

```bash
docker-compose down
docker volume prune
docker-compose up --build
```

---

## チームメンバーの招待（管理者向け）

Supabaseダッシュボード → **Settings** → **General** → **Team** → **Invite**

メールアドレスを入力して招待を送信してください。

---

## 開発フロー

1. ブランチ作成: `git checkout -b feature/機能名`
2. Docker起動: `docker-compose up`
3. コード変更（ホットリロードで自動反映）
4. コミット: `git commit -m "説明"`
5. プッシュ: `git push origin feature/機能名`
6. プルリクエスト作成
