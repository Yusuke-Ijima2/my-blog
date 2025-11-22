/**
 * page.tsx - トップページ（リダイレクト）
 *
 * ルートパス（/）にアクセスした場合、/blog にリダイレクト
 * 静的エクスポートではサーバーサイドリダイレクトが使えないため、
 * クライアントサイドでのナビゲーションを使用
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/blog');
  }, [router]);

  return null;
}
