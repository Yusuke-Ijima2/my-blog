/**
 * footer.tsx - サイト全体で使用するフッターコンポーネント
 *
 * 機能：
 * - コピーライト表示
 * - このサイトについてボタンとモーダル
 * - すべてのページの下部に表示される
 */

"use client";

import { useState, useRef } from "react";
import Modal from "./modal";

/**
 * Footer - グローバルフッターコンポーネント
 *
 * レイアウト：
 * - 上部にボーダー（border-t）で区切り線
 * - 上部マージン（mt-16）でコンテンツとの間隔を確保
 * - コピーライトと「このサイトについて」ボタン
 */
export default function Footer() {
  // 現在の年を取得（コピーライト表示用）
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // アクセシビリティ用のref
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  // モーダルを閉じる処理（元のボタンにフォーカスを戻す）
  const closeModal = () => {
    setIsModalOpen(false);
    // 次のレンダリング後にフォーカスを戻す
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 0);
  };

  return (
    <>
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row items-center justify-center gap-4 sm:gap-16">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {currentYear} ijima.dev. All rights reserved.
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="このサイトについて"
      >
        <p>飯嶋が自己満で記事を書くサイトです。</p>
      </Modal>
    </>
  );
}
