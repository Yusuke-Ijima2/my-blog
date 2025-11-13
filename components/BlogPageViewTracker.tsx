/**
 * BlogPageViewTracker.tsx - 記事ページ専用のページビュートラッカー
 *
 * このコンポーネントの役割：
 * 1. 記事ページに遷移するたびにGoogle Analyticsにページビューを送信
 * 2. クライアントサイドルーティング時も確実にトラッキング
 * 3. 本番環境のみで動作（開発環境では無効）
 *
 * 使用方法：
 * app/blog/[slug]/page.tsx に配置してください。
 *
 * 例:
 * export default async function BlogPost({ params }: PageProps) {
 *   return (
 *     <div>
 *       <BlogPageViewTracker slug={slug} />
 *       ...
 *     </div>
 *   );
 * }
 */

'use client'; // このコンポーネントはClient Componentとして動作

import { useEffect } from 'react';
import * as gtag from '@/lib/gtag';

/**
 * BlogPageViewTrackerProps - コンポーネントのprops型定義
 */
interface BlogPageViewTrackerProps {
  slug: string; // 記事のslug（例: "nextjs-static-export"）
}

/**
 * BlogPageViewTracker - 記事ページビュートラッカーコンポーネント
 *
 * 動作：
 * - コンポーネントがマウントされるたびにページビューを送信
 * - slugが変更されるたびにページビューを送信
 * - 本番環境のみで動作（開発環境では何もしない）
 *
 * 技術詳細：
 * - useEffectを使用してコンポーネントマウント時に実行
 * - slugを依存配列に含めることで、記事が変わるたびに実行
 * - gtag.pageview()で記事のパスをGoogle Analyticsに送信
 *
 * @param {BlogPageViewTrackerProps} props - コンポーネントのprops
 * @param {string} props.slug - 記事のslug
 * @returns {null} このコンポーネントはUIを描画しない
 */
export default function BlogPageViewTracker({ slug }: BlogPageViewTrackerProps) {
  useEffect(() => {
    // 記事ページのパスを構築（例: "/blog/nextjs-static-export"）
    const articlePath = `/blog/${slug}`;

    // 開発環境：デバッグログのみ出力（GA送信なし）
    if (process.env.NODE_ENV === 'development') {
      console.log('[BlogPageViewTracker] Page view would be tracked:', articlePath);
      return; // 実際のGA送信はしない
    }

    // 本番環境：Google Analyticsにページビューを送信
    if (process.env.NODE_ENV === 'production') {
      gtag.pageview(articlePath);
    }
  }, [slug]); // slugが変更されるたびに実行

  // このコンポーネントは何も描画しない
  return null;
}
