/**
 * Header.tsx - サイト全体で使用するヘッダーコンポーネント
 *
 * 機能：
 * - サイトロゴ/タイトルの表示
 * - すべてのページの上部に表示される
 */

import Link from "next/link"; // Next.jsのクライアントサイドルーティング用Linkコンポーネント
import ThemeToggle from "./ThemeToggle"; // テーマ切り替えコンポーネント

/**
 * Header - グローバルヘッダーコンポーネント
 *
 * レイアウト：
 * - 最大幅2xl（max-w-2xl）でコンテンツを中央揃え
 * - パディング（px-4 py-6）でゆとりを持たせる
 * - 下部にボーダー（border-b）で区切り線
 * - 右側にGitHubリンクを配置
 *
 * @returns {JSX.Element} ヘッダーのJSX
 */
export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      {/* コンテンツの最大幅を制限して中央揃え */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* サイトロゴ/タイトル - 記事一覧ページへのリンク */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-purple-400 transition-colors duration-200"
          >
            Ijima.dev
          </Link>

          {/* 右側のアイコングループ */}
          <div className="flex items-center gap-3">
            {/* テーマ切り替えボタン */}
            <ThemeToggle />

            {/* GitHubリンク */}
            <a
              href="https://github.com/Yusuke-Ijima2/my-blog"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 text-gray-900 dark:text-white hover:text-purple-400 dark:hover:text-purple-400 transition-colors duration-200 cursor-pointer"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
