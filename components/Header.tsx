/**
 * Header.tsx - サイト全体で使用するヘッダーコンポーネント
 *
 * 機能：
 * - サイトロゴ/タイトルの表示
 * - すべてのページの上部に表示される
 */

import Link from 'next/link'; // Next.jsのクライアントサイドルーティング用Linkコンポーネント

/**
 * Header - グローバルヘッダーコンポーネント
 *
 * レイアウト：
 * - 最大幅2xl（max-w-2xl）でコンテンツを中央揃え
 * - パディング（px-4 py-6）でゆとりを持たせる
 * - 下部にボーダー（border-b）で区切り線
 *
 * @returns {JSX.Element} ヘッダーのJSX
 */
export default function Header() {
  return (
    <header className="border-b border-gray-200">
      {/* コンテンツの最大幅を制限して中央揃え */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* サイトロゴ/タイトル - 記事一覧ページへのリンク */}
        <Link href="/blog" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
          Ijima.dev
        </Link>
      </div>
    </header>
  );
}
