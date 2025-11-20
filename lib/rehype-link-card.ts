/**
 * rehype-link-card.ts - URLだけの行をリンクカードに変換するrehypeプラグイン
 *
 * 機能：
 * - 段落内にURLだけが含まれる行を検出
 * - OGP情報を取得してリンクカードHTMLに変換
 */

import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';
import { unfurl } from 'unfurl.js';

// URLの正規表現
const urlRegex = /^https?:\/\/[^\s]+$/;

interface OgpData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  favicon: string;
}

// OGP情報をキャッシュ
const ogpCache = new Map<string, OgpData>();

async function fetchOgpData(url: string): Promise<OgpData> {
  // キャッシュを確認
  if (ogpCache.has(url)) {
    return ogpCache.get(url)!;
  }

  try {
    const result = await unfurl(url);

    const ogpData: OgpData = {
      title: result.open_graph?.title || result.title || url,
      description: result.open_graph?.description || result.description || '',
      image: result.open_graph?.images?.[0]?.url || '',
      url: url,
      siteName: result.open_graph?.site_name || new URL(url).hostname,
      favicon: result.favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`,
    };

    ogpCache.set(url, ogpData);
    return ogpData;
  } catch (error) {
    console.error(`Failed to fetch OGP for ${url}:`, error);

    // フォールバック
    const hostname = new URL(url).hostname;
    const fallbackData: OgpData = {
      title: url,
      description: '',
      image: '',
      url: url,
      siteName: hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}`,
    };

    ogpCache.set(url, fallbackData);
    return fallbackData;
  }
}

function createLinkCardElement(ogp: OgpData): Element {
  const children: Element[] = [];

  // 左側のコンテンツ部分
  const contentChildren: Element[] = [
    {
      type: 'element',
      tagName: 'div',
      properties: { className: ['link-card-title'] },
      children: [{ type: 'text', value: ogp.title }],
    },
  ];

  if (ogp.description) {
    contentChildren.push({
      type: 'element',
      tagName: 'div',
      properties: { className: ['link-card-description'] },
      children: [{ type: 'text', value: ogp.description }],
    });
  }

  // サイト情報（favicon + サイト名）
  contentChildren.push({
    type: 'element',
    tagName: 'div',
    properties: { className: ['link-card-meta'] },
    children: [
      {
        type: 'element',
        tagName: 'img',
        properties: {
          src: ogp.favicon,
          alt: '',
          className: ['link-card-favicon'],
          width: 16,
          height: 16,
        },
        children: [],
      },
      {
        type: 'element',
        tagName: 'span',
        properties: { className: ['link-card-site-name'] },
        children: [{ type: 'text', value: ogp.url }],
      },
    ],
  });

  children.push({
    type: 'element',
    tagName: 'div',
    properties: { className: ['link-card-content'] },
    children: contentChildren,
  });

  // 右側のサムネイル画像
  if (ogp.image) {
    children.push({
      type: 'element',
      tagName: 'div',
      properties: { className: ['link-card-thumbnail'] },
      children: [
        {
          type: 'element',
          tagName: 'img',
          properties: {
            src: ogp.image,
            alt: ogp.title,
          },
          children: [],
        },
      ],
    });
  }

  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href: ogp.url,
      className: ['link-card'],
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    children,
  };
}

export default function rehypeLinkCard() {
  return async (tree: Root) => {
    const promises: Promise<void>[] = [];

    visit(tree, 'element', (node: Element, index, parent) => {
      // p要素のみを処理
      if (node.tagName !== 'p' || !parent || index === undefined) return;

      // p要素の子要素が1つのテキストノードかリンクのみかを確認
      if (node.children.length === 1) {
        const child = node.children[0];

        let url: string | null = null;

        // テキストノードの場合
        if (child.type === 'text') {
          const text = (child as Text).value.trim();
          if (urlRegex.test(text)) {
            url = text;
          }
        }
        // リンク要素の場合（リンクテキストがURLと同じ場合）
        else if (
          child.type === 'element' &&
          (child as Element).tagName === 'a' &&
          (child as Element).children.length === 1 &&
          (child as Element).children[0].type === 'text'
        ) {
          const linkElement = child as Element;
          const href = linkElement.properties?.href as string;
          const text = ((linkElement.children[0] as Text).value || '').trim();

          if (href && text === href && urlRegex.test(href)) {
            url = href;
          }
        }

        if (url) {
          const promise = fetchOgpData(url).then((ogp) => {
            const linkCard = createLinkCardElement(ogp);
            (parent as Element).children[index] = linkCard;
          });
          promises.push(promise);
        }
      }
    });

    await Promise.all(promises);
  };
}
