/**
 * Footer.tsx - サイト全体で使用するフッターコンポーネント
 *
 * 機能：
 * - コピーライト表示
 * - すべてのページの下部に表示される
 */

/**
 * Footer - グローバルフッターコンポーネント
 *
 * レイアウト：
 * - 上部にボーダー（border-t）で区切り線
 * - 上部マージン（mt-16）でコンテンツとの間隔を確保
 * - シンプルなコピーライト表示のみ
 *
 * @returns {JSX.Element} フッターのJSX
 */
export default function Footer() {
  // 現在の年を取得（コピーライト表示用）
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-sm">
          &copy; {currentYear} Tech Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
