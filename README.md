# Tech Blog

Next.js Static Exportを使った技術ブログのMVPプロジェクトです。

## 技術スタック

- **Next.js**: 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Tailwind CSS**: v4
- **Markdown処理**:
  - gray-matter: frontmatterパース
  - remark + remark-html: Markdown→HTML変換
  - rehype-highlight: シンタックスハイライト

## 機能

- ✅ Markdownファイルから静的ブログ記事を生成
- ✅ 記事一覧ページ（日付順ソート）
- ✅ 記事詳細ページ（動的ルート）
- ✅ シンタックスハイライト対応
- ✅ レスポンシブデザイン
- ✅ 完全静的サイト（Static Export）
- ✅ Google Analytics 4統合（本番環境のみ）
- ✅ プライバシーポリシーページ

## プロジェクト構造

```
my-blog/
├── app/
│   ├── layout.tsx          # 共通レイアウト
│   ├── page.tsx            # トップページ（記事一覧）
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx    # 記事詳細ページ
│   ├── privacy/
│   │   └── page.tsx        # プライバシーポリシーページ
│   └── globals.css
├── components/
│   ├── Header.tsx          # ヘッダー
│   ├── Footer.tsx          # フッター
│   └── GoogleAnalytics.tsx # Google Analytics 4トラッキング
├── lib/
│   ├── posts.ts            # Markdown処理ロジック
│   └── gtag.ts             # Google Analyticsヘルパー関数
├── types/
│   └── gtag.d.ts           # Google Analytics型定義
├── posts/                  # Markdownファイル置き場
│   ├── nextjs-static-export.md
│   ├── typescript-type-safety.md
│   └── tailwind-css-guide.md
├── .env.local.example      # 環境変数サンプル
└── next.config.ts          # Static Export設定
```

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Google Analytics 4の設定（オプション）

本番環境でアクセス解析を行う場合は、Google Analytics 4を設定します。

#### 2-1. 環境変数ファイルの作成

```bash
cp .env.local.example .env.local
```

#### 2-2. Google Analytics測定IDの取得

1. [Google Analytics](https://analytics.google.com/)にログイン
2. **管理** → **プロパティ** → **データストリーム** を選択
3. **ウェブストリーム**を選択（または新規作成）
4. **測定ID**（G-XXXXXXXXXXの形式）をコピー

#### 2-3. 環境変数の設定

`.env.local`ファイルを開き、測定IDを設定します：

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**重要な注意点:**
- 開発環境（`npm run dev`）ではGoogle Analyticsは動作しません
- 本番ビルド（`npm run build`）とデプロイ後のみトラッキングが有効化されます
- `.env.local`は`.gitignore`に含まれているため、Gitにコミットされません
- デプロイ先（Vercel、Netlifyなど）で環境変数を設定する必要があります

#### デプロイ先での環境変数設定

**Vercel:**
1. プロジェクト設定 → Environment Variables
2. `NEXT_PUBLIC_GA_MEASUREMENT_ID`を追加

**Netlify:**
1. Site settings → Build & deploy → Environment
2. `NEXT_PUBLIC_GA_MEASUREMENT_ID`を追加

**GitHub Pages:**
- ビルド時に環境変数を設定（GitHub Actions使用）

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 記事の追加方法

`posts/`ディレクトリに新しいMarkdownファイルを作成します。

### Markdownファイルの形式

```markdown
---
title: "記事タイトル"
date: "2025-01-15"
description: "記事の説明文"
---

## 見出し

本文...

\`\`\`typescript
const example = "コード例";
\`\`\`
```

### frontmatterのフィールド

- `title`: 記事のタイトル（必須）
- `date`: 公開日（YYYY-MM-DD形式、必須）
- `description`: 記事の説明文（必須）

## ビルドとデプロイ

### 静的ファイルの生成

```bash
npm run build
```

ビルドが成功すると、`out/`ディレクトリに静的ファイルが生成されます。

### デプロイ先の例

生成された`out/`ディレクトリを以下のサービスにデプロイできます：

- **Vercel**: [https://vercel.com](https://vercel.com)
- **Netlify**: [https://netlify.com](https://netlify.com)
- **GitHub Pages**: [https://pages.github.com](https://pages.github.com)
- **AWS S3 + CloudFront**: 静的ホスティング
- **Firebase Hosting**: [https://firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)

### Vercelへのデプロイ（推奨）

```bash
npm install -g vercel
vercel
```

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルド（静的ファイル生成） |
| `npm run lint` | ESLintでコードチェック |
| `npm run type-check` | TypeScriptの型チェック |

## カスタマイズ

### サイト名の変更

`app/layout.tsx`の`metadata`を編集してください。

```typescript
export const metadata: Metadata = {
  title: "あなたのブログ名",
  description: "あなたのブログの説明",
};
```

### ヘッダー/フッターの編集

- ヘッダー: `components/Header.tsx`
- フッター: `components/Footer.tsx`

### スタイルのカスタマイズ

Tailwind CSSのユーティリティクラスを使ってスタイルをカスタマイズできます。

### カスタムイベントトラッキング

Google Analyticsでカスタムイベントを送信する場合、`lib/gtag.ts`のヘルパー関数を使用できます。

```typescript
import * as gtag from '@/lib/gtag';

// ボタンクリックを追跡
const handleClick = () => {
  gtag.event({
    action: 'click',
    category: 'engagement',
    label: 'CTA Button',
    value: 1,
  });
};

// フォーム送信を追跡
const handleSubmit = () => {
  gtag.event({
    action: 'submit',
    category: 'form',
    label: 'Contact Form',
  });
};
```

## 制限事項（Static Export）

Next.js Static Exportを使用しているため、以下の機能は使用できません：

- ❌ Server Components（サーバーコンポーネント）
- ❌ API Routes
- ❌ Middleware
- ❌ Image Optimization（next/imageの最適化機能）
- ❌ Incremental Static Regeneration（ISR）

これらの機能が必要な場合は、通常のNext.jsデプロイメントを検討してください。

## ライセンス

MIT

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
