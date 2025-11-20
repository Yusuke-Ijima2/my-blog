/**
 * TableOfContents.tsx - 記事の目次コンポーネント
 *
 * 機能：
 * - ビルド時に抽出された見出しを表示（SSG）
 * - クリックで見出しにスクロール
 * - 現在の閲覧位置をハイライト
 */

'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/posts';

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 見出しがない場合は何もしない
    if (headings.length === 0) return;

    // Intersection Observerで現在位置を追跡
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    // 見出し要素を監視
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">目次</h2>
      <ul className="space-y-2 text-base">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'pl-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              className={`transition-colors ${
                activeId === heading.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
