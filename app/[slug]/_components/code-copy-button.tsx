/**
 * code-copy-button.tsx - コードブロックにコピーボタンを追加するコンポーネント
 *
 * 機能：
 * - 記事内のすべてのコードブロックにコピーボタンを追加
 * - クリックでクリップボードにコピー
 * - コピー成功時にフィードバック表示
 */

'use client';

import { useEffect } from 'react';

export default function CodeCopyButton() {
  useEffect(() => {
    // すべてのpreタグを取得
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
      // すでにボタンがある場合はスキップ
      if (pre.querySelector('.copy-button')) return;

      // コピーボタンを作成
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.setAttribute('aria-label', 'コードをコピー');

      // ファイルアイコン（初期状態）
      const fileIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
      `;

      // チェックアイコン（コピー成功時）
      const checkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;

      button.innerHTML = fileIcon;

      // スタイルを適用
      button.style.cssText = `
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        padding: 0.5rem;
        background-color: #30363d;
        color: #c9d1d9;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // preタグをrelative positionに
      pre.style.position = 'relative';

      // ホバー時にボタンを表示
      pre.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });

      pre.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });

      // クリック時にコピー
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = code ? code.textContent || '' : pre.textContent || '';

        try {
          await navigator.clipboard.writeText(text);
          button.innerHTML = checkIcon;
          button.style.backgroundColor = '#238636';

          setTimeout(() => {
            button.innerHTML = fileIcon;
            button.style.backgroundColor = '#30363d';
          }, 2000);
        } catch {
          // エラー時もファイルアイコンに戻す
          setTimeout(() => {
            button.innerHTML = fileIcon;
          }, 2000);
        }
      });

      pre.appendChild(button);
    });
  }, []);

  return null;
}
