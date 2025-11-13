/**
 * gtag.d.ts - Google Analytics 4 (GA4) の型定義
 *
 * このファイルはGoogle Analytics 4のグローバル関数とオブジェクトの型定義を提供します。
 * TypeScriptでGA4を型安全に使用するために必要です。
 */

/**
 * GtagEvent - カスタムイベントのパラメータ型
 */
export interface GtagEvent {
  action: string; // イベントのアクション（例: "click", "submit", "download"）
  category: string; // イベントのカテゴリ（例: "engagement", "form", "navigation"）
  label?: string; // イベントのラベル（オプション、詳細な説明）
  value?: number; // イベントの値（オプション、数値データ）
}

/**
 * window.gtag - Google Analytics グローバル関数の型定義
 *
 * GA4のgtagコマンドを型安全に実行するための定義
 */
declare global {
  interface Window {
    /**
     * gtag関数 - Google Analyticsのコマンドを実行
     *
     * 使用例:
     * window.gtag('config', 'G-XXXXXXXXXX');
     * window.gtag('event', 'page_view', { page_path: '/blog/example' });
     */
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;

    /**
     * dataLayer - Google Analyticsのデータレイヤー
     *
     * GA4がイベントデータを格納する配列
     * 直接操作することは少なく、主にgtag関数を通じて使用される
     */
    dataLayer: Record<string, unknown>[];
  }
}

// このファイルをモジュールとして扱う
export {};
