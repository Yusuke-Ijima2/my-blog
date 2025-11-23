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
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-16">
            <button
              ref={triggerButtonRef}
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              aria-haspopup="dialog"
            >
              このサイトについて
            </button>
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} Ijima.dev. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* モーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-lg p-8 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="modal-title"
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              このサイトについて
            </h2>
            <p className="text-gray-700 mb-6">
              飯嶋が自己満で記事を書くサイトです。
            </p>
            <div className="flex justify-end">
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer"
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
