/**
 * modal.tsx - 汎用モーダルコンポーネント
 *
 * 機能：
 * - モーダルダイアログの表示
 * - 背景クリックで閉じる
 * - Escキーで閉じる
 * - 開いている間は背景のスクロールを無効化
 * - アクセシビリティ対応（フォーカス管理、ARIA属性）
 */

"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Modal - 汎用モーダルコンポーネント
 *
 * @param {boolean} isOpen - モーダルの開閉状態
 * @param {Function} onClose - モーダルを閉じる関数
 * @param {string} title - モーダルのタイトル
 * @param {React.ReactNode} children - モーダルの内容
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // モーダルが開いたら閉じるボタンにフォーカス & 背景のスクロールを無効化
  useEffect(() => {
    if (!isOpen) {
      // モーダルが閉じた時、スクロールを再有効化
      document.body.style.overflow = '';
      return;
    }

    // モーダルが開いた時、背景のスクロールを無効化
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    // クリーンアップ: コンポーネントがアンマウントされた時にスクロールを再有効化
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escキーでモーダルを閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 dark:bg-gray-900/60 flex items-center justify-center z-50"
      onClick={onClose}
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
          {title}
        </h2>
        <div className="text-gray-700 dark:text-gray-300 mb-6">
          {children}
        </div>
        <div className="flex justify-end">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
