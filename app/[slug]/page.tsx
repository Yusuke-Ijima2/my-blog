/**
 * [slug]/page.tsx - 記事詳細ページ（動的ルート）
 *
 * このページの役割：
 * 1. 個別の記事を表示（URL: /記事slug）
 * 2. マークダウンをHTMLに変換して表示
 * 3. ビルド時に全記事のページを静的生成
 *
 * 動的ルートの仕組み：
 * - ファイル名の[slug]は動的パラメータ
 * - 例: /claude-code-custom-commit-command → slug = "claude-code-custom-commit-command"
 * - generateStaticParams()で生成するページのパスを指定
 *
 * 静的生成（Static Site Generation）：
 * - ビルド時にgenerateStaticParams()で全slugを取得
 * - 各slugに対してHTMLを事前生成
 * - 結果: 高速な静的サイト（サーバー不要）
 */

import { notFound } from "next/navigation"; // 404ページを表示する関数
import Link from "next/link"; // Next.jsのクライアントサイドルーティング用Linkコンポーネント
import { getAllPostSlugs, getPostBySlug } from "@/app/_lib/posts"; // 記事データ取得関数
import dynamic from "next/dynamic"; // 動的インポート
import JsonLd from "@/app/_components/json-ld"; // 構造化データコンポーネント

// CodeCopyButtonを遅延ロード（初期表示に不要、TBT改善のため）
const CodeCopyButton = dynamic(() => import("@/app/[slug]/_components/code-copy-button"));

// TableOfContentsを遅延ロード（XL以上でのみ表示、TBT改善のため）
const TableOfContents = dynamic(() => import("@/app/[slug]/_components/table-of-contents"));

/**
 * PageProps - ページコンポーネントのprops型定義
 *
 * Next.js 16では、paramsがPromiseになりました。
 * そのため、await paramsで値を取得する必要があります。
 */
interface PageProps {
  params: Promise<{
    slug: string; // URL内の動的パラメータ（例: "nextjs-static-export"）
  }>;
}

/**
 * dynamicParams - 動的パラメータの処理を無効化
 *
 * 静的エクスポートモードでは、generateStaticParams()で指定したパスのみを生成します。
 * falseに設定することで、存在しないslugへのアクセス時に404を返します。
 */
export const dynamicParams = false;

/**
 * generateStaticParams - 静的生成するページのパス一覧を返す
 *
 * この関数は、ビルド時にNext.jsによって呼び出されます。
 * 返された各slugに対して、個別のHTMLページが生成されます。
 *
 * 動作の流れ：
 * 1. getAllPostSlugs()で全記事のslugを取得
 *    例: ["nextjs-static-export", "typescript-type-safety", ...]
 * 2. 各slugをオブジェクトに変換して返す
 *    例: [{ slug: "nextjs-static-export" }, { slug: "typescript-type-safety" }, ...]
 * 3. Next.jsが各slugに対してページを生成
 *    例: /nextjs-static-export.html, /typescript-type-safety.html, ...
 */
export async function generateStaticParams() {
  // 全記事のslugを取得
  const slugs = getAllPostSlugs();

  // Next.jsの期待する形式に変換
  // ["slug1", "slug2"] → [{ slug: "slug1" }, { slug: "slug2" }]
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

/**
 * generateMetadata - ページのメタデータを動的に生成
 *
 * この関数は、各ページのSEO情報（title, descriptionなど）を設定します。
 * ビルド時およびランタイムで呼び出されます。
 *
 * メタデータの用途：
 * - ブラウザのタブタイトル
 * - 検索エンジンの検索結果
 * - SNSでシェアされた時のプレビュー
 */
export async function generateMetadata({ params }: PageProps) {
  // paramsからslugを取得（Next.js 16ではawaitが必要）
  const { slug } = await params;

  // slugに対応する記事データを取得
  const post = await getPostBySlug(slug);

  // 記事が見つからない場合
  if (!post) {
    return {
      title: "Not Found", // 404ページのタイトル
    };
  }

  // 記事のメタデータを返す
  return {
    title: post.title, // templateで | Ijima.dev が自動追加される
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ['Ijima'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

/**
 * BlogPost - 記事詳細ページのコンポーネント
 *
 * レイアウト：
 * 1. 記事一覧へ戻るリンク
 * 2. 記事ヘッダー（タイトル、日付）
 * 3. 記事本文（HTMLとして表示）
 *
 * スタイリング：
 * - proseクラス: Tailwind Typographyの基本スタイル
 * - prose-*: 見出し、段落、リスト、コードなどの詳細スタイル
 */
export default async function BlogPost({ params }: PageProps) {
  // paramsからslugを取得（Next.js 16ではawaitが必要）
  const { slug } = await params;

  // slugに対応する記事データを取得（本文のHTML含む）
  const post = await getPostBySlug(slug);

  // 記事が見つからない場合は404ページを表示
  if (!post) {
    notFound(); // Next.jsの404ページにリダイレクト
  }

  // 構造化データ（JSON-LD）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Ijima',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ijima.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ijima.dev/icon.svg',
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* 記事一覧に戻るリンク */}
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-400 hover:text-purple-400 mb-8 inline-block transition-colors duration-200"
        >
          ← 記事一覧へ
        </Link>
      </div>

      {/* 記事と目次のコンテナ */}
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-12">
          {/* 記事本体 */}
          <article className="flex-1 min-w-0">
            {/* 記事ヘッダー */}
            <header className="mb-8">
              {/* 記事タイトル */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              {/* 公開日 */}
              <time className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {post.date}
              </time>
            </header>

            {/* 記事本文（HTMLとして表示） */}
            <div
              className="prose prose-sm md:prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:dark:text-white
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:scroll-mt-8 prose-h2:pb-1 prose-h2:border-b prose-h2:border-gray-200 prose-h2:dark:border-gray-700 prose-h2:text-gray-900 prose-h2:dark:text-white
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-8 prose-h3:text-gray-900 prose-h3:dark:text-white
                prose-p:text-gray-800 prose-p:dark:text-white prose-p:leading-relaxed prose-p:my-3
                prose-a:text-purple-600 prose-a:dark:text-white prose-a:underline prose-a:decoration-purple-400 prose-a:hover:text-purple-400 prose-a:hover:decoration-purple-300 prose-a:transition-colors prose-a:duration-200
                prose-code:text-purple-600 prose-code:dark:text-purple-400 prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto prose-pre:p-1 prose-pre:rounded-lg
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-800 prose-li:dark:text-white
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:dark:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic
                prose-strong:font-bold prose-strong:text-gray-900 prose-strong:dark:text-white"
              /*
                className解説（Tailwind Typography）：
                - prose: Typographyの基本スタイル
                - prose-lg: 大きめのフォントサイズ
                - prose-slate: Slateカラーパレット
                - max-w-none: 最大幅の制限を解除

                各要素のスタイル：
                - prose-headings: 全見出しを太字
                - prose-h2: h2のサイズと余白（大見出し）
                - prose-h3: h3のサイズと余白（小見出し）
                - prose-p: 段落のテキスト色と行間
                - prose-a: リンクの色と下線（ホバー時のみ）
                - prose-code: インラインコードの色と背景
                - prose-pre: コードブロックの背景と色（シンタックスハイライト用）
                - prose-ul/ol: リストのスタイル
                - prose-li: リストアイテムのテキスト色
                - prose-blockquote: 引用のスタイル（左ボーダー、イタリック）
                - prose-strong: 強調テキスト（太字）
              */
              dangerouslySetInnerHTML={{ __html: post.content }}
              /*
                dangerouslySetInnerHTML解説：
                - マークダウンから変換したHTMLを直接挿入
                - "dangerous"という名前だが、自分で生成したHTMLなので安全
                - ユーザー入力を直接挿入するとXSS攻撃のリスクがあるため注意
                - 今回はマークダウンファイルを自分で管理しているので問題なし
              */
            />
            <CodeCopyButton />
          </article>

          {/* 目次サイドバー */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents headings={post.headings} />
          </aside>
        </div>
      </div>
    </div>
    </>
  );
}
