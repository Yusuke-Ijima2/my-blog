/**
 * opengraph-image.tsx - OGP画像を動的に生成
 *
 * Next.jsのImageResponseを使用してOGP画像を生成します。
 * SNSでシェアされた時に表示される画像です。
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ijima.dev - 技術ブログ';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
          }}
        >
          Ijima.dev
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
          }}
        >
          技術ブログ - Next.js, TypeScript, Tailwind CSS
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
