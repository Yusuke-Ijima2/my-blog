---
title: "Next.js Static Exportで高速な静的サイトを構築する"
date: "2025-01-15"
description: "Next.js Static Exportの仕組みと、完全静的なウェブサイトを構築する方法を解説します。"
---

## Next.js Static Exportとは

Next.js Static Exportは、Next.jsアプリケーションを完全に静的なHTMLファイルとして出力する機能です。この機能を使うことで、サーバーレスでホスティングできる高速なウェブサイトを構築できます。

## Static Exportの利点

### 1. 高速なパフォーマンス

静的ファイルとして配信されるため、サーバー側の処理が不要で非常に高速です。CDNを使ってグローバルに配信することで、さらにパフォーマンスを向上させることができます。

### 2. 低コスト

静的ファイルホスティングは、従来のサーバーホスティングと比べて非常に低コストです。GitHub Pages、Netlify、Vercelなどで無料ホスティングも可能です。

### 3. セキュリティ

サーバー側のロジックが存在しないため、セキュリティリスクが大幅に低減されます。

## 設定方法

Next.js 13以降では、`next.config.js`に以下の設定を追加するだけでStatic Exportが有効になります。

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## 制限事項

Static Exportを使用する場合、以下の機能は使用できません：

- Server Components（サーバーコンポーネント）
- API Routes
- Middleware
- Image Optimization（next/imageの最適化機能）
- Incremental Static Regeneration（ISR）

これらの機能が必要な場合は、通常のNext.jsデプロイメントを検討しましょう。

## ビルドと確認

Static Exportを有効にした後、以下のコマンドでビルドします：

```bash
npm run build
```

ビルドが成功すると、`out`ディレクトリに静的ファイルが生成されます。このディレクトリの内容を任意の静的ホスティングサービスにデプロイするだけです。

## まとめ

Next.js Static Exportは、ブログやドキュメントサイトなど、動的な機能が不要なウェブサイトに最適です。高速で安全、かつ低コストなサイト運営が可能になります。
