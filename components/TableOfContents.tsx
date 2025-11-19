/**
 * TableOfContents.tsx - 記事の目次コンポーネント
 *
 * 機能：
 * - 記事のHTMLから見出しを抽出
 * - サイドバーに目次を表示
 * - クリックで見出しにスクロール
 * - 現在の閲覧位置をハイライト
 */

'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 記事本文から見出しを抽出
    const articleElement = document.querySelector('article');
    if (!articleElement) return;

    const headingElements = articleElement.querySelectorAll('h2, h3');
    const extractedHeadings: Heading[] = [];

    headingElements.forEach((heading) => {
      const id = heading.id;
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.substring(1));

      if (id && text) {
        extractedHeadings.push({ id, text, level });
      }
    });

    // ESLint warning about setState in effect is not applicable here.
    // This is a legitimate use case: synchronizing with external DOM content after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(extractedHeadings);

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

    headingElements.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      headingElements.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, []);

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
