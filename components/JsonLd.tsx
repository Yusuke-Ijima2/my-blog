/**
 * JsonLd.tsx - 構造化データ（JSON-LD）コンポーネント
 *
 * Google等の検索エンジンにコンテンツの構造を伝えるための
 * Schema.org形式のJSON-LDデータを出力します。
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
