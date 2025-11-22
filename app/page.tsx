/**
 * page.tsx - トップページ（リダイレクト）
 *
 * ルートパス（/）にアクセスした場合、/blog にリダイレクト
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/blog');
}
