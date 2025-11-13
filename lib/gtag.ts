/**
 * gtag.ts - Google Analytics 4 (GA4) カスタムイベントヘルパー関数
 *
 * このファイルは以下の機能を提供します：
 * 1. ページビュー送信（pageview）
 * 2. カスタムイベント送信（event）
 * 3. 型安全なGA4操作
 *
 * 使用例：
 * import * as gtag from '@/lib/gtag';
 * gtag.pageview('/blog/example');
 * gtag.event({ action: 'click', category: 'button', label: 'CTA' });
 */

import type { GtagEvent } from '@/types/gtag';

/**
 * GA_MEASUREMENT_ID - Google Analytics 測定ID
 *
 * 環境変数から取得します。
 * Static Exportの場合、ビルド時に値が埋め込まれます。
 *
 * 設定方法:
 * 1. .env.localファイルを作成
 * 2. NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXXを追加
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * pageview - ページビューをGoogle Analyticsに送信
 *
 * Next.jsのクライアントサイドルーティング時に使用します。
 * 通常、useRouterのイベントリスナーで呼び出されます。
 *
 * 使用例:
 * ```typescript
 * import { useRouter } from 'next/router';
 * import { useEffect } from 'react';
 * import * as gtag from '@/lib/gtag';
 *
 * const router = useRouter();
 * useEffect(() => {
 *   const handleRouteChange = (url: string) => {
 *     gtag.pageview(url);
 *   };
 *   router.events.on('routeChangeComplete', handleRouteChange);
 *   return () => {
 *     router.events.off('routeChangeComplete', handleRouteChange);
 *   };
 * }, [router.events]);
 * ```
 *
 * @param {string} url - ページのURL（例: "/blog/nextjs-static-export"）
 */
export const pageview = (url: string): void => {
  // gtagが定義されていない場合は何もしない（開発環境など）
  if (typeof window.gtag === 'undefined') {
    return;
  }

  // GA4にページビューイベントを送信
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url, // ページのパス
  });
};

/**
 * event - カスタムイベントをGoogle Analyticsに送信
 *
 * ユーザーのアクション（クリック、フォーム送信など）を追跡します。
 *
 * 使用例:
 * ```typescript
 * import * as gtag from '@/lib/gtag';
 *
 * // ボタンクリックを追跡
 * gtag.event({
 *   action: 'click',
 *   category: 'engagement',
 *   label: 'CTA Button',
 *   value: 1,
 * });
 *
 * // フォーム送信を追跡
 * gtag.event({
 *   action: 'submit',
 *   category: 'form',
 *   label: 'Contact Form',
 * });
 *
 * // ファイルダウンロードを追跡
 * gtag.event({
 *   action: 'download',
 *   category: 'engagement',
 *   label: 'PDF Resume',
 * });
 * ```
 *
 * @param {GtagEvent} params - イベントパラメータ
 * @param {string} params.action - イベントのアクション（必須）
 * @param {string} params.category - イベントのカテゴリ（必須）
 * @param {string} [params.label] - イベントのラベル（オプション）
 * @param {number} [params.value] - イベントの値（オプション）
 */
export const event = ({ action, category, label, value }: GtagEvent): void => {
  // gtagが定義されていない場合は何もしない（開発環境など）
  if (typeof window.gtag === 'undefined') {
    return;
  }

  // GA4にカスタムイベントを送信
  window.gtag('event', action, {
    event_category: category, // イベントのカテゴリ
    event_label: label, // イベントのラベル（オプション）
    value: value, // イベントの値（オプション）
  });
};
