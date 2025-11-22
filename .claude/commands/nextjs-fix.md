---
description: Next.jsのベストプラクティスに沿ってコードを検証・修正
---

# Next.js MCP Best Practice Fix

このコマンドは、Next.js MCP (Model Context Protocol) サーバーを使用して、現在のコードをNext.jsの公式ドキュメントとベストプラクティスに基づいて検証し、必要に応じて修正を提案します。

## 実行手順

1. **Next.js MCPの初期化**
   - `mcp__next-devtools__init` ツールを呼び出し、最新のNext.jsドキュメントを取得
   - プロジェクトコンテキストを確立

2. **問題の特定**
   - ユーザーが指定したファイル、またはgit diffから変更されたファイルを解析
   - Next.js 16の非同期API（params, searchParams, cookies, headers）の使用を確認
   - 静的エクスポート（`output: 'export'`）との互換性を確認
   - Image Optimizationの使用状況を確認

3. **ドキュメント検索**
   - 検出された問題に関連するNext.js公式ドキュメントを検索
   - `mcp__next-devtools__nextjs_docs` ツールで関連ドキュメントを取得
   - App RouterとPages Routerの違いを考慮

4. **修正提案**
   - 公式ドキュメントに基づいた修正案を提示
   - 修正理由を技術的に説明
   - 複数の選択肢がある場合は、それぞれのトレードオフを説明

5. **修正の適用**
   - ユーザーの承認を得た後、Editツールで修正を適用
   - 必要に応じて複数ファイルを一括修正

## 対象とする問題パターン

### 1. Next.js 16 非同期APIの未対応
```typescript
// ❌ Bad (Next.js 16では動かない)
export default function Page({ params }: PageProps) {
  const { slug } = params;
}

// ✅ Good
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
}
```

### 2. 静的エクスポートで未サポートの機能
- Image Optimization（default loader）
- Server Actions
- Dynamic Routes without `generateStaticParams()`
- Middleware
- API Routes

### 3. App Router固有の問題
- Client Componentでの `use client` ディレクティブ漏れ
- Server Componentでのブラウザ専用API使用
- `use cache` の不適切な使用

### 4. パフォーマンスとベストプラクティス
- 不要な `"use client"` ディレクティブ
- 未最適化の画像読み込み（静的エクスポート対応）
- 不適切なキャッシュ戦略

## 使用例

### 特定のファイルを検証
```
/nextjs-fix app/blog/[slug]/page.tsx
```

### 変更されたファイルを一括検証
```
/nextjs-fix
```

### ランタイム診断と組み合わせ
```
/nextjs-fix --runtime
```
（開発サーバーが起動している場合、`mcp__next-devtools__nextjs_runtime` でエラーログを取得）

## 重要な原則

1. **公式ドキュメント優先**: 必ず `mcp__next-devtools__nextjs_docs` で最新情報を確認
2. **最小限の変更**: 必要な修正のみを行い、over-engineeringを避ける
3. **説明責任**: 修正の理由を技術的根拠とともに説明
4. **静的エクスポートへの配慮**: `output: 'export'` との互換性を常に確認

## MCPツールの使い方

```typescript
// 1. 初期化（セッション開始時に1回）
await mcp__next-devtools__init({ project_path: process.cwd() });

// 2. ドキュメント検索
await mcp__next-devtools__nextjs_docs({
  action: 'search',
  query: 'static export image optimization',
  routerType: 'app'
});

// 3. ドキュメント取得
await mcp__next-devtools__nextjs_docs({
  action: 'get',
  path: '/docs/app/api-reference/config/next-config-js/output'
});

// 4. ランタイム診断（dev server起動時）
await mcp__next-devtools__nextjs_runtime({
  action: 'list_tools'
});
```
