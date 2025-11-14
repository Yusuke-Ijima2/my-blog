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

## プロジェクト構造

```
my-blog/
├── app/
│   ├── layout.tsx          # 共通レイアウト
│   ├── page.tsx            # トップページ（記事一覧）
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx    # 記事詳細ページ
│   └── globals.css
├── components/
│   ├── Header.tsx          # ヘッダー
│   └── Footer.tsx          # フッター
├── lib/
│   └── posts.ts            # Markdown処理ロジック
├── public/                 # 静的ファイル
│   └── posts/              # 記事ディレクトリ（完全なコロケーション）
│       ├── nextjs-static-export/
│       │   ├── index.md    # 記事のMarkdown
│       │   └── (画像ファイル)
│       ├── typescript-type-safety/
│       │   ├── index.md
│       │   └── (画像ファイル)
│       └── tailwind-css-guide/
│           ├── index.md
│           └── (画像ファイル)
└── next.config.ts          # Static Export設定
```

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 記事の追加方法

`public/posts/`ディレクトリに新しい記事ディレクトリを作成します。

### 記事の作成手順

1. 記事のslug（URL）を決める（例: `my-new-article`）
2. `public/posts/my-new-article/` ディレクトリを作成
3. `public/posts/my-new-article/index.md` ファイルを作成
4. 画像がある場合は同じディレクトリに配置

### Markdownファイルの形式

```markdown
---
title: "記事タイトル"
date: "2025-01-15"
description: "記事の説明文"
---

## 見出し

本文...

![画像の説明](./image.png)

\`\`\`typescript
const example = "コード例";
\`\`\`
```

### frontmatterのフィールド

- `title`: 記事のタイトル（必須）
- `date`: 公開日（YYYY-MM-DD形式、必須）
- `description`: 記事の説明文（必須）

### 画像の追加方法

記事と画像を同じディレクトリに配置できます（完全なコロケーション）。

**ディレクトリ構造:**
```
public/posts/
  nextjs-static-export/
    index.md                    # 記事のMarkdown
    screenshot1.png             # 記事で使う画像
    diagram.svg
```

**Markdownでの記述（2つの方法）:**

1. **相対パス（推奨）:**
```markdown
![スクリーンショット](./screenshot1.png)
```

2. **絶対パス:**
```markdown
![スクリーンショット](/posts/nextjs-static-export/screenshot1.png)
```

**メリット:**
- 記事と画像が完全に同じ場所に配置される
- 記事ごとに画像が整理される
- 画像の名前が重複しても問題ない
- 記事のディレクトリをコピーすれば移植も簡単

対応している画像形式：PNG, JPG, GIF, SVG, WebP など

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

### Cloudflare Pagesへのデプロイ（推奨）

Cloudflare Pagesは高速で、無料でWeb Analyticsが利用できます。

1. [Cloudflare Pages](https://pages.cloudflare.com/)にログイン
2. GitHubリポジトリを接続
3. ビルド設定：
   - **ビルドコマンド**: `npm run build`
   - **ビルド出力ディレクトリ**: `out`
4. デプロイ

### アクセス解析

Cloudflare Web Analyticsを使用しています。

**特徴:**
- ✅ **Cookie不要** - プライバシー重視
- ✅ **自動有効化** - Cloudflare Pagesで自動的に有効
- ✅ **リアルタイム** - ページビュー、訪問者数、リファラーを確認可能
- ✅ **無料** - 追加費用なし

**確認方法:**
1. Cloudflare Pagesダッシュボードを開く
2. プロジェクトを選択
3. **Web Analytics**タブをクリック
4. ページビュー、訪問者数、人気ページなどを確認

Google Analyticsのような複雑な設定は不要で、シンプルにページビュー数を確認できます。

### Vercelへのデプロイ

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
