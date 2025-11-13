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

import Link from 'next/link'; // Next.jsのクライアントサイドルーティング用Linkコンポーネント
import { getAllPosts } from '@/lib/posts'; // 記事一覧を取得する関数

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* サイト説明セクション */}
      <section className="mb-16">
        {/* サイトタイトル */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Blog</h1>
        {/* サイト説明 */}
        <p className="text-lg text-gray-600">
          Next.js、TypeScript、Tailwind CSSなどの技術記事を発信しています。
        </p>
      </section>

      {/* 記事一覧セクション */}
      <section>
        {/* セクションタイトル */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">最新記事</h2>

        {/* 記事がない場合のメッセージ */}
        {posts.length === 0 ? (
          <p className="text-gray-600">記事がまだありません。</p>
        ) : (
          // 記事一覧の表示
          <div className="space-y-8"> {/* space-y-8: 記事間の縦方向の間隔 */}
            {/* 各記事をループで表示 */}
            {posts.map((post) => (
              <article
                key={post.slug} // Reactのkey（ユニークな識別子）
                className="border-b border-gray-200 pb-8 last:border-b-0"
                // className解説：
                // - border-b: 下部にボーダー（区切り線）
                // - pb-8: 下部パディング
                // - last:border-b-0: 最後の記事はボーダーなし
              >
                {/* 記事タイトル（クリック可能） */}
                <Link href={`/blog/${post.slug}`} className="group">
                  {/* group: 子要素でhover時のスタイル変更を可能にする */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {/* group-hover:text-blue-600: タイトルにホバー時に青色に変更 */}
                    {/* transition-colors: 色変化をスムーズにアニメーション */}
                    {post.title}
                  </h3>
                </Link>

                {/* 公開日 */}
                <time className="text-sm text-gray-500 mb-3 block">
                  {/* time要素: 日付を意味的に表す（SEOに有利） */}
                  {post.date} {/* 例: 2025-01-15 */}
                </time>

                {/* 記事の説明文 */}
                <p className="text-gray-700 mb-4">{post.description}</p>

                {/* 記事詳細へのリンク */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  続きを読む →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
