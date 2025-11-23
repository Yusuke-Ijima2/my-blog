/**
 * layout.tsx - アプリケーション全体の共通レイアウト
 *
 * このファイルは以下の機能を提供します：
 * 1. HTMLの基本構造（html, head, body）
 * 2. グローバルなメタデータ（title, description）
 * 3. Webフォントの設定（Geist Sans, Geist Mono）
 * 4. 共通コンポーネント（Header）の配置
 * 5. グローバルスタイル（globals.css）の読み込み
 *
 * 注意：
 * - このレイアウトはすべてのページに適用されます
 * - 子ページのコンテンツは{children}の部分に表示されます
 */

import type { Metadata } from "next"; // Next.jsのメタデータ型定義
import { Noto_Sans_JP } from "next/font/google"; // Google Fontsからフォントをインポート
import "./globals.css"; // グローバルスタイル（Tailwind CSS、Typography設定など）
import Header from "@/components/Header"; // ヘッダーコンポーネント
import Footer from "@/components/Footer"; // フッターコンポーネント

/**
 * Noto Sans JP フォントの設定
 *
 * パフォーマンス最適化のため、以下の設定を採用：
 * - display: "swap" - システムフォントを優先表示し、フォント読み込み後に切り替え
 * - preload: false - 初期ロードを高速化（必要時に読み込み）
 * - adjustFontFallback: true - フォールバックフォントとのレイアウトシフトを最小化
 *
 * Noto Sans JPは33個のサブセットに分割されており、全て読み込むとLCPが遅延します。
 * そのため、preloadをfalseにして初期ロードを軽量化します。
 */
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

/**
 * グローバルメタデータ
 * - すべてのページのデフォルトタイトルと説明文
 * - 各ページで個別に上書き可能
 * - SEO（検索エンジン最適化）に重要
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://ijima.dev'),
  title: {
    default: "Ijima.dev",
    template: "%s | Ijima.dev",
  },
  description:
    "技術ブログ - Next.js, TypeScript, Tailwind CSSなどの技術記事を発信",
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://ijima.dev',
    siteName: 'Ijima.dev',
    title: 'Ijima.dev',
    description: '技術ブログ - Next.js, TypeScript, Tailwind CSSなどの技術記事を発信',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ijima.dev',
    description: '技術ブログ - Next.js, TypeScript, Tailwind CSSなどの技術記事を発信',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * RootLayout - アプリケーション全体のルートレイアウトコンポーネント
 *
 * レイアウト構造：
 * <html>
 *   <head>
 *     - highlight.jsのCSSを読み込み（シンタックスハイライト用）
 *   </head>
 *   <body>
 *     - Header（ヘッダー）
 *     - main（メインコンテンツ - 各ページの内容）
 *   </body>
 * </html>
 *
 * @param {Object} props - コンポーネントのprops
 * @param {React.ReactNode} props.children - 子ページのコンテンツ
 * @returns {JSX.Element} ルートレイアウトのJSX
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
        // suppressHydrationWarning:
        // - ブラウザ拡張機能（ColorZilla、Grammarly等）がbodyタグに属性を追加するため
        // - ハイドレーション警告を抑制（本番環境では問題なし）
        // className解説：
        // - notoSansJP.variable: Noto Sans JPのCSS変数を設定
        // - antialiased: フォントのアンチエイリアス（滑らかな表示）を有効化
        // - flex flex-col: 縦方向のflexboxレイアウト
        // - min-h-screen: 最低でも画面の高さを確保
      >
        {/* ヘッダー - すべてのページの上部に表示 */}
        <Header />

        {/* メインコンテンツエリア - 各ページの内容が表示される */}
        <main className="flex-1">
          {children}
        </main>

        {/* フッター - すべてのページの下部に表示 */}
        <Footer />
      </body>
    </html>
  );
}
