/**
 * page.tsx - トップページ（記事一覧ページ）
 *
 * このページの役割：
 * 1. サイトのトップページとして機能（URL: /）
 * 2. 全記事を日付順（新しい順）で一覧表示
 * 3. 各記事へのリンクを提供
 *
 * 表示内容：
 * - サイトタイトルと説明
 * - 記事一覧（タイトル、日付、説明、リンク）
 */

import Link from "next/link"; // Next.jsのクライアントサイドルーティング用Linkコンポーネント
import { getAllPosts } from "@/lib/posts"; // 記事一覧を取得する関数

/**
 * Home - トップページコンポーネント
 *
 * データ取得：
 * - getAllPosts()で全記事のメタデータを取得
 * - 記事は日付順（新しい順）にソート済み
 *
 * レイアウト：
 * - 最大幅4xl（max-w-4xl）でコンテンツを中央揃え
 * - 上部にサイト説明セクション
 * - 下部に記事一覧セクション
 *
 * @returns {JSX.Element} トップページのJSX
 */
export default function Home() {
  // 全記事のメタデータを取得（日付順にソート済み）
  // posts = [{ slug: "...", title: "...", date: "2025-01-15", description: "..." }, ...]
  const posts = getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 記事一覧セクション */}
      <section className="max-w-5xl mx-auto">
        {/* セクションタイトル */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">記事一覧</h2>

        {/* 記事がない場合のメッセージ */}
        {posts.length === 0 ? (
          <p className="text-gray-600">記事がまだありません。</p>
        ) : (
          // 記事一覧の表示
          <div className="space-y-4">
            {" "}
            {/* space-y-8: 記事間の縦方向の間隔 */}
            {/* 各記事をループで表示 */}
            {posts.map((post) => (
              <article
                key={post.slug} // Reactのkey（ユニークな識別子）
                className="border-b border-gray-200 last:border-b-0"
                // className解説：
                // - border-b: 下部にボーダー（区切り線）
                // - pb-8: 下部パディング
                // - last:border-b-0: 最後の記事はボーダーなし
              >
                {/* 記事タイトル（クリック可能） */}
                <Link href={`/${post.slug}`} className="group">
                  {/* group: 子要素でhover時のスタイル変更を可能にする */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-purple-400 transition-colors duration-200">
                    {/* group-hover:text-purple-400: タイトルにホバー時に薄い紫色に変更 */}
                    {/* transition-colors duration-200: 色変化を200msでスムーズにアニメーション */}
                    {post.title}
                  </h3>
                </Link>

                {/* 公開日 */}
                <time className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                  {/* time要素: 日付を意味的に表す（SEOに有利） */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {post.date} {/* 例: 2025-01-15 */}
                </time>

                {/* 記事の説明文 */}
                <p className="text-gray-700 mb-4">{post.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
