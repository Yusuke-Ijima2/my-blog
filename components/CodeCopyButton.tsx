/**
 * CodeCopyButton.tsx - コードブロックにコピーボタンを追加するコンポーネント
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
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'コードをコピー');

      // スタイルを適用
      button.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        background-color: #30363d;
        color: #c9d1d9;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
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
          button.textContent = 'Copied!';
          button.style.backgroundColor = '#238636';

          setTimeout(() => {
            button.textContent = 'Copy';
            button.style.backgroundColor = '#30363d';
          }, 2000);
        } catch {
          button.textContent = 'Failed';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        }
      });

      pre.appendChild(button);
    });
  }, []);

  return null;
}
