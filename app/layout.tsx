/**
 * layout.tsx - アプリケーション全体の共通レイアウト
 *
 * このファイルは以下の機能を提供します：
 * 1. HTMLの基本構造（html, head, body）
 * 2. グローバルなメタデータ（title, description）
 * 3. Webフォントの設定（Geist Sans, Geist Mono）
 * 4. 共通コンポーネント（Header, Footer）の配置
 * 5. グローバルスタイル（globals.css）の読み込み
 *
 * 注意：
 * - このレイアウトはすべてのページに適用されます
 * - 子ページのコンテンツは{children}の部分に表示されます
 */

import type { Metadata } from "next"; // Next.jsのメタデータ型定義
import { Geist, Geist_Mono } from "next/font/google"; // Google Fontsからフォントをインポート
import "./globals.css"; // グローバルスタイル（Tailwind CSS、Typography設定など）
import Header from "@/components/Header"; // ヘッダーコンポーネント
import Footer from "@/components/Footer"; // フッターコンポーネント

/**
 * Geist Sans フォントの設定
 * - variable: CSS変数名（--font-geist-sans）
 * - subsets: 読み込むフォントのサブセット（latinは英数字）
 * - このフォントはサイト全体の本文に使用されます
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono フォントの設定
 * - variable: CSS変数名（--font-geist-mono）
 * - subsets: 読み込むフォントのサブセット（latinは英数字）
 * - このフォントはコードブロックやインラインコードに使用されます
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * グローバルメタデータ
 * - すべてのページのデフォルトタイトルと説明文
 * - 各ページで個別に上書き可能
 * - SEO（検索エンジン最適化）に重要
 */
export const metadata: Metadata = {
  title: "Tech Blog", // ブラウザのタブに表示されるタイトル
  description: "技術ブログ - Next.js, TypeScript, Tailwind CSSなどの技術記事を発信", // 検索結果に表示される説明文
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
 *     - Footer（フッター）
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
    <html lang="ja"> {/* 言語を日本語に設定 */}
      <head>
        {/*
          highlight.jsのCSSを読み込み
          - シンタックスハイライト用のスタイル
          - github-darkテーマを使用（暗めの背景）
          - CDNから読み込むことで高速化
        */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // className解説：
        // - geistSans.variable: Geist SansのCSS変数を設定
        // - geistMono.variable: Geist MonoのCSS変数を設定
        // - antialiased: フォントのアンチエイリアス（滑らかな表示）を有効化
      >
        {/* ヘッダー - すべてのページの上部に表示 */}
        <Header />

        {/* メインコンテンツエリア - 各ページの内容が表示される */}
        <main className="min-h-screen">
          {/* min-h-screen: 画面の高さを最低限確保してフッターを下部に配置 */}
          {children}
        </main>

        {/* フッター - すべてのページの下部に表示 */}
        <Footer />
      </body>
    </html>
  );
}
