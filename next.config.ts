/**
 * next.config.ts - Next.jsの設定ファイル
 *
 * このファイルでは、Next.jsアプリケーションの動作をカスタマイズします。
 * ビルドの挙動、画像の最適化、ルーティングなどを制御できます。
 *
 * 今回の設定：
 * - Static Export（完全静的サイト）を有効化
 * - 画像の最適化を無効化（Static Exportでは使用不可のため）
 */

import type { NextConfig } from "next";

/**
 * Next.js設定オブジェクト
 */
const nextConfig: NextConfig = {
  /**
   * output: 'export' - Static Export（静的サイト生成）を有効化
   *
   * この設定により：
   * 1. ビルド時に完全な静的HTML/CSS/JSを生成
   * 2. 生成ファイルは`out/`ディレクトリに出力
   * 3. サーバー不要で動作（GitHub Pages、Netlify、S3などで配信可能）
   *
   * 制限事項：
   * - Server Components（サーバーコンポーネント）は使用不可
   * - API Routes（/api/*）は使用不可
   * - Middleware（middleware.ts）は使用不可
   * - Image Optimization（next/imageの最適化機能）は使用不可
   * - Incremental Static Regeneration（ISR）は使用不可
   * - Revalidation（revalidate）は使用不可
   *
   * 参考：https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: 'export',

  /**
   * images.unoptimized: true - 画像の最適化を無効化
   *
   * なぜ必要か：
   * - Static Exportでは、Next.jsの画像最適化機能は動作しません
   * - 画像最適化はNode.jsサーバーが必要な機能のため
   *
   * 代替手段：
   * 1. 通常のHTMLのimgタグを使用
   *    例: <img src="/image.jpg" alt="説明" />
   * 2. 画像を事前に最適化してから配置
   *    - WebP/AVIF形式に変換
   *    - 適切なサイズにリサイズ
   * 3. 外部の画像CDNサービスを利用
   *    - Cloudinary、Imgix など
   *
   * 注意：
   * - next/imageコンポーネントを使用する場合、この設定が必須
   * - 設定しないとビルドエラーになります
   */
  images: {
    unoptimized: true,
  },

  /**
   * experimental.optimizePackageImports - パッケージインポートの最適化
   *
   * 大きなライブラリから必要な部分だけをインポートすることで、
   * バンドルサイズを削減し、初期ロード時間を改善します。
   */
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },

  /**
   * compiler.removeConsole - 本番ビルドでconsoleを削除
   *
   * 本番環境でconsole.log等を自動削除し、バンドルサイズを削減します。
   */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  /*
    その他の設定例（必要に応じて追加可能）：

    // ベースパスの設定（サブディレクトリで公開する場合）
    basePath: '/blog',

    // トレイリングスラッシュの追加（/page → /page/）
    trailingSlash: true,

    // カスタムリダイレクト設定
    async redirects() {
      return [
        {
          source: '/old-blog/:slug',
          destination: '/blog/:slug',
          permanent: true,
        },
      ];
    },

    // 環境変数の公開
    env: {
      CUSTOM_KEY: 'value',
    },

    // webpack設定のカスタマイズ
    webpack: (config, { isServer }) => {
      // カスタムwebpack設定
      return config;
    },
  */
};

/**
 * 設定をエクスポート
 * Next.jsがこの設定を自動的に読み込みます
 */
export default nextConfig;
