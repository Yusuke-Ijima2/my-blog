/**
 * posts.ts - マークダウン記事の読み込みと処理を行うユーティリティ
 *
 * このファイルは以下の機能を提供します：
 * 1. posts/ディレクトリからマークダウンファイルを読み込む
 * 2. frontmatter（記事のメタデータ）をパースする
 * 3. マークダウンをHTMLに変換する
 * 4. シンタックスハイライトを適用する
 */

import fs from 'fs'; // Node.jsのファイルシステムモジュール
import path from 'path'; // パス操作用のモジュール
import matter from 'gray-matter'; // frontmatter（---で囲まれたメタデータ）をパースするライブラリ
import { remark } from 'remark'; // マークダウン処理の中核ライブラリ
import remarkRehype from 'remark-rehype'; // マークダウンをHTMLに変換するプラグイン
import rehypeHighlight from 'rehype-highlight'; // コードブロックにシンタックスハイライトを適用するプラグイン
import rehypeStringify from 'rehype-stringify'; // HTML構造を文字列に変換するプラグイン
import { cache } from 'react'; // Reactのキャッシュ機能（同じレンダリング内で重複呼び出しを防ぐ）

// postsディレクトリの絶対パスを取得
// process.cwd()はプロジェクトのルートディレクトリを返す
// public/posts/ に記事とその画像を配置（完全なコロケーション）
const postsDirectory = path.join(process.cwd(), 'public', 'posts');

/**
 * PostData - 記事の完全なデータ（本文のHTML含む）
 * 記事詳細ページで使用します
 */
export interface PostData {
  slug: string; // URLに使用するファイル名（例: "nextjs-static-export"）
  title: string; // 記事のタイトル
  date: string; // 公開日（YYYY-MM-DD形式）
  description: string; // 記事の説明文（一覧ページで表示）
  content: string; // 記事本文のHTML（マークダウンから変換済み）
}

/**
 * PostMeta - 記事のメタデータのみ（本文は含まない）
 * 記事一覧ページで使用します（本文を読み込まないので高速）
 */
export interface PostMeta {
  slug: string; // URLに使用するファイル名
  title: string; // 記事のタイトル
  date: string; // 公開日
  description: string; // 記事の説明文
}

/**
 * getAllPosts - 全記事のメタデータを取得して日付順（新しい順）にソート
 *
 * 使用例：
 * const posts = getAllPosts();
 * // => [{ slug: "...", title: "...", date: "2025-01-15", ... }, ...]
 *
 * @returns {PostMeta[]} 記事メタデータの配列（日付降順）
 */
export function getAllPosts(): PostMeta[] {
  // postsディレクトリが存在しない場合は空配列を返す
  // （初回セットアップ時などのエラーを防ぐため）
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // postsディレクトリ内のすべてのエントリを取得
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });

  // ディレクトリのみをフィルタして、それぞれのメタデータを取得
  const allPostsData = entries
    .filter((entry) => entry.isDirectory() && entry.name !== '.git') // ディレクトリのみ（.gitkeepなどを除外）
    .map((entry) => {
      // ディレクトリ名がslugになる
      // 例: "nextjs-static-export/" → "nextjs-static-export"
      const slug = entry.name;

      // index.mdのパスを作成
      const fullPath = path.join(postsDirectory, slug, 'index.md');

      // index.mdが存在しない場合はスキップ
      if (!fs.existsSync(fullPath)) {
        return null;
      }

      // ファイルの内容をUTF-8で読み込み
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // gray-matterでfrontmatter（---で囲まれた部分）をパース
      // data: frontmatterの内容（title, date, descriptionなど）
      // content: マークダウン本文
      const { data } = matter(fileContents);

      // メタデータのみを返す（本文は含まない）
      return {
        slug,
        title: data.title || '', // frontmatterにtitleがない場合は空文字
        date: data.date || '', // frontmatterにdateがない場合は空文字
        description: data.description || '', // frontmatterにdescriptionがない場合は空文字
      };
    })
    .filter((post): post is PostMeta => post !== null); // nullを除外

  // 日付順（新しい順）でソート
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1; // aがbより古い場合、bを前に
    } else {
      return -1; // aがbより新しいか同じ場合、aを前に
    }
  });
}

/**
 * getAllPostSlugs - 全記事のslug（ファイル名）の配列を取得
 *
 * Next.jsのgenerateStaticParamsで使用します。
 * 静的サイト生成時に、どのURLを生成するかをNext.jsに伝えます。
 *
 * 使用例：
 * const slugs = getAllPostSlugs();
 * // => ["nextjs-static-export", "typescript-type-safety", ...]
 *
 * @returns {string[]} slugの配列
 */
export function getAllPostSlugs(): string[] {
  // postsディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // postsディレクトリ内のすべてのエントリを取得
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });

  // ディレクトリ名をslugとして返す
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== '.git')
    .filter((entry) => {
      // index.mdが存在するディレクトリのみ
      const indexPath = path.join(postsDirectory, entry.name, 'index.md');
      return fs.existsSync(indexPath);
    })
    .map((entry) => entry.name);
}

/**
 * getPostBySlug - 指定したslugの記事データを取得（本文のHTML含む）
 *
 * マークダウン処理の流れ：
 * 1. ファイルを読み込み
 * 2. frontmatterをパース（gray-matter）
 * 3. マークダウン → HTML変換（remark → rehype）
 * 4. シンタックスハイライト適用（rehype-highlight）
 * 5. HTML文字列化（rehype-stringify）
 *
 * パフォーマンス最適化：
 * - React cache()でラップ（同じレンダリング内での重複呼び出しを防ぐ）
 * - generateMetadata()とページコンポーネントで同じslugを呼んでも1回だけ実行
 *
 * 使用例：
 * const post = await getPostBySlug("nextjs-static-export");
 * // => { slug: "...", title: "...", content: "<h2>見出し</h2>...", ... }
 *
 * @param {string} slug - 取得したい記事のslug（ファイル名）
 * @returns {Promise<PostData | null>} 記事データ（見つからない場合はnull）
 */
export const getPostBySlug = cache(async (slug: string): Promise<PostData | null> => {
  try {
    // ファイルパスを作成（例: public/posts/nextjs-static-export/index.md）
    const fullPath = path.join(postsDirectory, slug, 'index.md');

    // ファイルの内容をUTF-8で読み込み
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matterでfrontmatterとマークダウン本文を分離
    // data: frontmatterの内容（title, date, descriptionなど）
    // content: マークダウン本文
    const { data, content } = matter(fileContents);

    // マークダウンをHTMLに変換（シンタックスハイライト付き）
    // 処理の流れ：
    // 1. remark() - マークダウンパーサーを初期化
    // 2. .use(remarkRehype) - マークダウンASTをHTML ASTに変換
    // 3. .use(rehypeHighlight) - コードブロックにシンタックスハイライトを適用
    // 4. .use(rehypeStringify) - HTML ASTを文字列に変換
    // 5. .process(content) - 実際の変換を実行
    const processedContent = await remark()
      .use(remarkRehype) // Markdown → HTML変換
      .use(rehypeHighlight) // コードハイライト（highlight.js使用）
      .use(rehypeStringify) // HTML文字列化
      .process(content);

    // 変換結果を文字列として取得
    const contentHtml = processedContent.toString();

    // 記事データを返す
    return {
      slug,
      title: data.title || '', // frontmatterのtitle
      date: data.date || '', // frontmatterのdate
      description: data.description || '', // frontmatterのdescription
      content: contentHtml, // 変換後のHTML
    };
  } catch (error) {
    // ファイルが見つからない、パースエラーなどの場合
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
});
