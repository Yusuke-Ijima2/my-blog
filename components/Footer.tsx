/**
 * Footer.tsx - サイト全体で使用するフッターコンポーネント
 *
 * 機能：
 * - コピーライト表示
 * - このサイトについてボタンとモーダル
 * - すべてのページの下部に表示される
 */

"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Footer - グローバルフッターコンポーネント
 *
 * レイアウト：
 * - 上部にボーダー（border-t）で区切り線
 * - 上部マージン（mt-16）でコンテンツとの間隔を確保
 * - コピーライトと「このサイトについて」ボタン
 *
 * @returns {JSX.Element} フッターのJSX
 */
export default function Footer() {
  // 現在の年を取得（コピーライト表示用）
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // アクセシビリティ用のref
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // モーダルが開いたら閉じるボタンにフォーカス
  useEffect(() => {
    if (!isModalOpen) return;

    closeButtonRef.current?.focus();
  }, [isModalOpen]);

  // モーダルを閉じる処理（元のボタンにフォーカスを戻す）
  const closeModal = () => {
    setIsModalOpen(false);
    // 次のレンダリング後にフォーカスを戻す
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 0);
  };

  // Escキーでモーダルを閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  return (
    <>
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row items-center justify-center gap-4 sm:gap-16">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {currentYear} Ijima.dev. All rights reserved.
            </p>
            <button
              ref={triggerButtonRef}
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-400 dark:hover:text-purple-400 cursor-pointer transition-colors duration-200"
              aria-haspopup="dialog"
            >
              このサイトについて
            </button>
          </div>
        </div>
      </footer>

      {/* モーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 dark:bg-gray-900/60 flex items-center justify-center z-50"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="modal-title"
              className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4"
            >
              このサイトについて
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              飯嶋が自己満で記事を書くサイトです。
            </p>
            <div className="flex justify-end">
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
