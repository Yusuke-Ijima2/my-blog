/**
 * Header.tsx - サイト全体で使用するヘッダーコンポーネント
 *
 * 機能：
 * - サイトロゴ/タイトルの表示
 * - ナビゲーションメニューの表示
 * - すべてのページの上部に表示される
 */

import Link from 'next/link'; // Next.jsのクライアントサイドルーティング用Linkコンポーネント

/**
 * Header - グローバルヘッダーコンポーネント
 *
 * レイアウト：
 * - 最大幅4xl（max-w-4xl）でコンテンツを中央揃え
 * - パディング（px-4 py-6）でゆとりを持たせる
 * - 下部にボーダー（border-b）で区切り線
 *
 * @returns {JSX.Element} ヘッダーのJSX
 */
export default function Header() {
  return (
    <header className="border-b border-gray-200">
      {/* コンテンツの最大幅を制限して中央揃え */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* フレックスボックスでロゴとナビを両端配置 */}
        <div className="flex items-center justify-between">
          {/* サイトロゴ/タイトル - ホームページへのリンク */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
            Tech Blog
          </Link>

          {/* ナビゲーションメニュー */}
          <nav>
            <ul className="flex gap-6">
              {/* ホームリンク */}
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  ホーム
                </Link>
              </li>
              {/* Aboutリンク（ページ内アンカー） */}
              <li>
                <Link href="/#about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              {/*
                必要に応じて追加のリンクをここに追加できます：
                <li>
                  <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                    カテゴリー
                  </Link>
                </li>
              */}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
