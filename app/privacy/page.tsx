/**
 * privacy/page.tsx - プライバシーポリシーページ
 *
 * このページの役割：
 * 1. Google Analyticsの使用について説明
 * 2. Cookieの使用について説明
 * 3. データ収集の詳細を提供
 * 4. オプトアウト方法を案内
 *
 * 法的要件：
 * - GDPR（EU一般データ保護規則）対応
 * - 日本の個人情報保護法対応
 * - Googleのポリシー要件対応
 */

import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * メタデータ - SEOとブラウザタブ用
 */
export const metadata: Metadata = {
  title: 'プライバシーポリシー | Tech Blog',
  description:
    'Tech Blogのプライバシーポリシー。Google Analyticsの使用、Cookieの使用、データ収集について説明しています。',
};

/**
 * PrivacyPage - プライバシーポリシーページコンポーネント
 *
 * スタイリング：
 * - Tailwind Typographyのproseクラスを使用
 * - 読みやすいタイポグラフィ
 * - 最大幅を制限（max-w-4xl）
 *
 * @returns {JSX.Element} プライバシーポリシーページのJSX
 */
export default function PrivacyPage() {
  // 最終更新日を動的に取得（現在の年月日）
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* ホームへ戻るリンク */}
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
        ← ホームに戻る
      </Link>

      {/* プライバシーポリシー本文 */}
      <article className="prose prose-lg prose-slate max-w-none">
        <h1>プライバシーポリシー</h1>

        <p className="text-gray-500 text-sm">最終更新日: {currentDate}</p>

        <section>
          <h2>1. はじめに</h2>
          <p>
            Tech Blog（以下「当サイト」）は、訪問者のプライバシーを尊重し、個人情報の保護に努めています。
            このプライバシーポリシーでは、当サイトがどのような情報を収集し、どのように使用するかを説明します。
          </p>
        </section>

        <section>
          <h2>2. 収集する情報</h2>
          <p>当サイトでは、以下の情報を収集する場合があります：</p>
          <ul>
            <li>
              <strong>アクセス解析データ</strong>: Google Analytics 4を使用して、訪問者の行動データを収集します。
            </li>
            <li>
              <strong>Cookie情報</strong>: サイトの機能向上とアクセス解析のためにCookieを使用します。
            </li>
            <li>
              <strong>ブラウザ情報</strong>: ブラウザの種類、バージョン、OS、画面解像度などの技術情報。
            </li>
            <li>
              <strong>アクセス情報</strong>: 訪問したページ、滞在時間、参照元サイトなどの情報。
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Google Analytics 4の使用について</h2>
          <p>
            当サイトでは、Googleが提供するアクセス解析ツール「Google Analytics 4」を使用しています。
            Google Analytics 4は、Cookieを使用して訪問者の情報を収集します。
          </p>

          <h3>収集される情報</h3>
          <ul>
            <li>訪問者の行動データ（ページビュー、クリック、スクロール深度など）</li>
            <li>デバイス情報（デバイスの種類、OS、ブラウザなど）</li>
            <li>地理的位置情報（国、地域、都市レベル）</li>
            <li>トラフィックソース（どこからアクセスしたか）</li>
          </ul>

          <h3>情報の使用目的</h3>
          <ul>
            <li>サイトの利用状況を把握し、コンテンツを改善する</li>
            <li>訪問者の興味・関心を分析し、より良い情報を提供する</li>
            <li>サイトのパフォーマンスを監視し、問題を特定する</li>
          </ul>

          <p>
            Google Analyticsによって収集されたデータは、Googleのプライバシーポリシーに基づいて管理されます。
            詳細は
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Googleプライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>

        <section>
          <h2>4. Cookieについて</h2>
          <p>
            Cookieとは、Webサイトがユーザーのコンピュータに保存する小さなテキストファイルです。
            当サイトでは、以下の目的でCookieを使用します：
          </p>
          <ul>
            <li>訪問者の行動を分析し、サイトの改善に役立てる</li>
            <li>訪問者の興味・関心に基づいたコンテンツを提供する</li>
            <li>サイトのパフォーマンスを向上させる</li>
          </ul>

          <h3>使用するCookieの種類</h3>
          <ul>
            <li>
              <strong>必須Cookie</strong>: サイトの基本機能に必要（当サイトでは現在使用していません）
            </li>
            <li>
              <strong>分析Cookie</strong>: Google Analytics 4が使用する分析用Cookie
            </li>
          </ul>
        </section>

        <section>
          <h2>5. データの第三者提供について</h2>
          <p>
            当サイトは、収集した個人情報を以下の場合を除き、第三者に提供することはありません：
          </p>
          <ul>
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要な場合</li>
          </ul>
          <p>
            Google Analytics 4を通じて収集されたデータは、Googleに提供されます。
            Googleは、独自のプライバシーポリシーに従ってデータを処理します。
          </p>
        </section>

        <section>
          <h2>6. トラッキングのオプトアウト方法</h2>
          <p>Google Analyticsによるトラッキングを無効にする方法は以下の通りです：</p>

          <h3>方法1: ブラウザのCookie設定</h3>
          <p>
            ブラウザの設定でCookieを無効にすることで、Google
            Analyticsのトラッキングを防ぐことができます。
            ただし、一部のサイト機能が正常に動作しなくなる可能性があります。
          </p>

          <h3>方法2: Google Analyticsオプトアウトアドオン</h3>
          <p>
            Googleが提供する
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Analyticsオプトアウトアドオン
            </a>
            をインストールすることで、すべてのサイトでGoogle
            Analyticsのトラッキングを無効にできます。
          </p>
        </section>

        <section>
          <h2>7. データの保持期間</h2>
          <p>
            Google Analytics 4で収集されたデータは、Googleのデータ保持ポリシーに従って保持されます。
            当サイトでは、デフォルトの保持期間（最大14ヶ月）を使用しています。
          </p>
        </section>

        <section>
          <h2>8. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、必要に応じてこのプライバシーポリシーを変更することがあります。
            変更があった場合は、このページで通知します。最終更新日を確認してください。
          </p>
        </section>

        <section>
          <h2>9. お問い合わせ</h2>
          <p>
            このプライバシーポリシーに関するご質問や懸念がある場合は、以下の方法でお問い合わせください：
          </p>
          <ul>
            <li>
              サイト運営者: Tech Blog
            </li>
            <li>
              連絡方法: サイトのお問い合わせフォームをご利用ください
            </li>
          </ul>
        </section>

        <section>
          <h2>10. 適用法令</h2>
          <p>
            このプライバシーポリシーは、日本国の個人情報保護法およびEUの一般データ保護規則（GDPR）に準拠しています。
          </p>
        </section>
      </article>

      {/* ホームへ戻るリンク（下部） */}
      <div className="mt-12">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← ホームに戻る
        </Link>
      </div>
    </div>
  );
}
