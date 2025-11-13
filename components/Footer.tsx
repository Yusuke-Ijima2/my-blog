/**
 * Footer.tsx - サイト全体で使用するフッターコンポーネント
 *
 * 機能：
 * - コピーライト表示
 * - プライバシーポリシーへのリンク
 * - すべてのページの下部に表示される
 */

import Link from 'next/link'; // Next.jsのLinkコンポーネント

/**
 * Footer - グローバルフッターコンポーネント
 *
 * レイアウト：
 * - 上部にボーダー（border-t）で区切り線
 * - 上部マージン（mt-16）でコンテンツとの間隔を確保
 * - 最大幅4xl（max-w-4xl）でコンテンツを中央揃え
 *
 * @returns {JSX.Element} フッターのJSX
 */
export default function Footer() {
  // 現在の年を取得（コピーライト表示用）
  // 例: 2025
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 mt-16">
      {/* コンテンツの最大幅を制限して中央揃え */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* コピーライト表示（中央揃え） */}
        <p className="text-center text-gray-600 text-sm">
          &copy; {currentYear} Tech Blog. All rights reserved.
        </p>

        {/* フッターリンク（中央揃え） */}
        <div className="flex justify-center gap-6 mt-4">
          {/* プライバシーポリシーへのリンク */}
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
          >
            プライバシーポリシー
          </Link>

          {/*
            将来的に追加可能なリンク：

            <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
              利用規約
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
              お問い合わせ
            </Link>
          */}
        </div>
      </div>
    </footer>
  );
}
