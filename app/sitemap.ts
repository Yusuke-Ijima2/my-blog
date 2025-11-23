/**
 * sitemap.ts - サイトマップを動的に生成
 *
 * Next.jsのApp Routerでは、sitemap.tsファイルを作成することで
 * 自動的にサイトマップが生成されます。
 *
 * 参考: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { getAllPostSlugs } from '@/lib/posts';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/**
 * サイトマップを生成する関数
 * ビルド時に自動的に呼び出され、/sitemap.xmlとして出力されます
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ijima.dev';

  // 全記事のslugを取得
  const postSlugs = getAllPostSlugs();

  // 記事ページのURLを生成
  const blogPosts = postSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 静的ページのURL
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ];

  // 全てのURLを結合して返す
  return [...staticPages, ...blogPosts];
}
