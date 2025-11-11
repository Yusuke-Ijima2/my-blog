/**
 * [slug]/page.tsx - 記事詳細ページ（動的ルート）
 *
 * このページの役割：
 * 1. 個別の記事を表示（URL: /blog/記事slug）
 * 2. マークダウンをHTMLに変換して表示
 * 3. ビルド時に全記事のページを静的生成
 *
 * 動的ルートの仕組み：
 * - ファイル名の[slug]は動的パラメータ
 * - 例: /blog/nextjs-static-export → slug = "nextjs-static-export"
 * - generateStaticParams()で生成するページのパスを指定
 *
 * 静的生成（Static Site Generation）：
 * - ビルド時にgenerateStaticParams()で全slugを取得
 * - 各slugに対してHTMLを事前生成
 * - 結果: 高速な静的サイト（サーバー不要）
 */

import { notFound } from 'next/navigation'; // 404ページを表示する関数
import Link from 'next/link'; // Next.jsのクライアントサイドルーティング用Linkコンポーネント
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'; // 記事データ取得関数

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
 *    例: /blog/nextjs-static-export.html, /blog/typescript-type-safety.html, ...
 *
 * @returns {Array<{slug: string}>} 生成するページのslug一覧
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
 *
 * @param {PageProps} props - ページのprops（slugを含む）
 * @returns {Promise<Metadata>} メタデータオブジェクト
 */
export async function generateMetadata({ params }: PageProps) {
  // paramsからslugを取得（Next.js 16ではawaitが必要）
  const { slug } = await params;

  // slugに対応する記事データを取得
  const post = await getPostBySlug(slug);

  // 記事が見つからない場合
  if (!post) {
    return {
      title: 'Not Found', // 404ページのタイトル
    };
  }

  // 記事のメタデータを返す
  return {
    title: `${post.title} | Tech Blog`, // 例: "Next.js Static Exportで高速な静的サイトを構築する | Tech Blog"
    description: post.description, // 記事の説明文（検索結果に表示される）
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
 *
 * @param {PageProps} props - ページのprops（slugを含む）
 * @returns {Promise<JSX.Element>} 記事詳細ページのJSX
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 記事一覧に戻るリンク */}
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
      >
        ← 記事一覧に戻る
      </Link>

      {/* 記事本体 */}
      <article>
        {/* 記事ヘッダー */}
        <header className="mb-8">
          {/* 記事タイトル */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          {/* 公開日 */}
          <time className="text-gray-500">{post.date}</time>
        </header>

        {/* 記事本文（HTMLとして表示） */}
        <div
          className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
            prose-strong:font-bold prose-strong:text-gray-900"
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
      </article>
    </div>
  );
}
