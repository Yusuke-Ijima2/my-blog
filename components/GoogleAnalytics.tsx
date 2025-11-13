/**
 * GoogleAnalytics.tsx - Google Analytics 4 (GA4) トラッキングコンポーネント
 *
 * このコンポーネントの役割：
 * 1. Google Analytics 4のトラッキングスクリプトを読み込む
 * 2. 本番環境のみでGA4を有効化（開発環境では無効）
 * 3. 環境変数から測定IDを取得
 * 4. ページパフォーマンスを妨げない最適化
 *
 * 使用方法：
 * app/layout.tsxの<body>タグ内に配置してください。
 *
 * 例:
 * <body>
 *   <GoogleAnalytics />
 *   <Header />
 *   ...
 * </body>
 */

'use client'; // このコンポーネントはClient Componentとして動作

import Script from 'next/script'; // Next.jsの最適化されたScriptコンポーネント
import { GA_MEASUREMENT_ID } from '@/lib/gtag'; // 測定ID

/**
 * GoogleAnalytics - GA4トラッキングコンポーネント
 *
 * 動作条件：
 * - 本番環境（NODE_ENV === 'production'）
 * - 測定IDが設定されている（NEXT_PUBLIC_GA_MEASUREMENT_ID）
 *
 * これらの条件を満たさない場合、何も表示されません。
 *
 * @returns {JSX.Element | null} GA4スクリプト、または null
 */
export default function GoogleAnalytics() {
  // 本番環境かどうかをチェック
  const isProduction = process.env.NODE_ENV === 'production';

  // 測定IDが設定されているかチェック
  const hasMeasurementId = GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== '';

  // 開発環境、または測定IDが未設定の場合は何も表示しない
  if (!isProduction || !hasMeasurementId) {
    return null;
  }

  return (
    <>
      {/*
        Google Analytics 4のメインスクリプトを読み込み

        strategy="afterInteractive"の意味：
        - ページのインタラクティブ化（操作可能になる）後にスクリプトを読み込む
        - ページの初期表示を妨げない（パフォーマンス最適化）
        - Next.jsが自動的に最適なタイミングで読み込む

        src: GA4のスクリプトURL
        - GA_MEASUREMENT_IDを含むURLでgtag.jsを読み込む
      */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />

      {/*
        Google Analytics 4の初期化スクリプト

        このスクリプトの役割：
        1. dataLayerの初期化（GA4のデータ格納配列）
        2. gtag関数の定義（GA4のコマンド実行関数）
        3. 現在時刻の記録（パフォーマンス計測用）
        4. GA4の設定（測定IDを使用）

        dangerouslySetInnerHTMLの使用理由：
        - GA4の初期化コードは信頼できる（Google公式）
        - 動的に測定IDを挿入する必要がある
        - ユーザー入力ではないため、XSSリスクはない
      */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
