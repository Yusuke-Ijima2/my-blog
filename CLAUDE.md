# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a technical blog built with Next.js Static Export. It generates a completely static site from Markdown files, deployable to any static hosting service (Cloudflare Pages, Vercel, Netlify, GitHub Pages, etc.).

**Key Technology:**
- **Next.js 16.0.1** with App Router
- **React 19.2.0**
- **TypeScript 5.x**
- **Tailwind CSS v4** with Typography plugin
- **Static Export mode** (`output: 'export'` in next.config.ts)

## Development Commands

```bash
npm run dev           # Start development server (http://localhost:3000)
npm run build         # Build static site (outputs to out/ directory)
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript type checking without emitting files
```

## Architecture

### Static Site Generation Strategy

This project uses Next.js Static Export, which means:
- All pages are pre-rendered to static HTML at build time
- No Node.js server required for deployment
- **Server Components run at build time** and are fully supported
- Dynamic server features (API Routes, Middleware, ISR) are **not available**
- Images must use `unoptimized: true` in next.config.ts

**Important:** `redirect()` function IS supported in Server Components during static export. It gets converted to client-side navigation. Config-based redirects in next.config.ts are NOT supported.

### Content Structure: Complete Colocation

Blog posts live in `public/posts/` with a **complete colocation** structure:

```
public/posts/
  article-slug/
    index.md          # Article Markdown with frontmatter
    image1.png        # Article images
    diagram.svg
```

**Benefits:**
- Articles and their assets are completely co-located
- No naming conflicts between different articles
- Easy to move/copy entire article directories
- Images can use relative paths: `![alt](./image.png)`

**Frontmatter format:**
```markdown
---
title: "Article Title"
date: "2025-01-15"
description: "Article description for listing pages"
---

## Content here...
```

### Markdown Processing Pipeline

The `lib/posts.ts` file handles all Markdown processing:

1. **Read**: Read `index.md` from `public/posts/{slug}/`
2. **Parse**: Extract frontmatter with `gray-matter`
3. **Transform**: Markdown → HTML via remark/rehype pipeline:
   - `remark` → parse Markdown
   - `remarkGfm` → GitHub Flavored Markdown support
   - `remarkRehype` → convert to HTML AST
   - `rehypeSlug` → add IDs to headings (for table of contents anchor links)
   - `rehypeCodeTitles` → add filename labels to code blocks
   - `rehypeHighlight` → apply syntax highlighting to code blocks
   - `rehypeLinkCard` → convert URL-only lines to rich link cards with OGP data
   - `rehypeStringify` → convert to HTML string

**Key Functions:**
- `getAllPosts()`: Returns all post metadata (sorted by date, newest first) - used for blog listing
- `getAllPostSlugs()`: Returns array of slugs - used for `generateStaticParams()`
- `getPostBySlug(slug)`: Returns full post data including HTML content - used for article detail pages

**Note:** React `cache()` is NOT used because static export runs at build time only, making request-level caching unnecessary.

### Routing Structure

- `/` - Root page (article listing) (app/page.tsx)
- `/[slug]` - Article detail pages (app/[slug]/page.tsx)

The `[slug]` dynamic route uses `generateStaticParams()` to pre-render all articles at build time, with `dynamicParams = false` to ensure only statically generated paths are valid.

### Layout System

All pages use a consistent two-tier layout structure for alignment:

```tsx
<div className="max-w-7xl mx-auto px-4 py-12">  {/* Outer container */}
  <div className="max-w-5xl mx-auto">            {/* Inner content container */}
    {/* Content here */}
  </div>
</div>
```

This structure is used in:
- Header (`components/Header.tsx`)
- Footer (`components/Footer.tsx`)
- Article listing (`app/page.tsx`)
- Article detail pages (`app/[slug]/page.tsx`)

### Table of Contents

Article detail pages include a client-side table of contents (`components/TableOfContents.tsx`) that:
- Extracts h2/h3 headings from the article DOM after mount
- Displays in a sticky sidebar on XL+ screens (`hidden xl:block w-64 shrink-0`)
- Uses `rehypeSlug` to ensure headings have IDs for anchor links
- Scroll offset configured with `scroll-mt-8` on headings

### Typography and Styling

**Tailwind CSS v4 Configuration:**
- Uses new CSS-first configuration via `app/globals.css`
- No `tailwind.config.ts` required
- Import: `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"`
- Theme variables defined with `@theme inline` directive

**Dark Mode Implementation:**
- Uses class-based dark mode (`.dark` class on `<html>`)
- Background: Gray (#1f2937) instead of pure black for better readability
- Text: White (#ffffff) for maximum contrast
- **Important:** Tailwind's utility classes (`dark:text-white`) may not work in v4. Use direct CSS selectors in `globals.css`:
  ```css
  .dark h1, .dark h2, .dark p, .dark a {
    color: #ffffff !important;
  }
  ```
- System preference support via `@media (prefers-color-scheme: dark)`

**Typography:**
Articles use Tailwind Typography (`@tailwindcss/typography`) with extensive customization:
- Code blocks: `prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-1`
- Inline code: `prose-code:text-pink-600 prose-code:bg-gray-100`
- Headings: `prose-h2:scroll-mt-8` for proper anchor link scrolling
- Syntax highlighting: GitHub Dark theme via highlight.js (local)
- Font: System font stack (no external fonts) for optimal performance

### Link Cards

URL を単独行で記述すると、自動的にOGP情報付きのリンクカードに変換されます：

```markdown
https://example.com/article
```

- `lib/rehype-link-card.ts` が unfurl.js を使用してOGPデータを取得
- タイトル、サムネイル画像、URLをカード形式で表示
- スタイルは `app/globals.css` の `.link-card` クラスで定義
- 外部サービスのNext.js Image Optimization URL (`/_next/image?url=...`) を検出した場合、元の画像URLを自動抽出

## Adding New Articles

1. Create directory: `public/posts/my-article-slug/`
2. Create `index.md` with frontmatter:
   ```markdown
   ---
   title: "Article Title"
   date: "2025-01-15"
   description: "Brief description"
   ---

   ## Content here...
   ```
3. Add images to the same directory (prefer WebP format for optimal performance)
4. Reference images with relative paths: `![alt](./image.png)`
5. Run `node scripts/convert-to-webp.mjs` to convert PNG/JPEG to WebP (optional but recommended)
6. Run `npm run build` to regenerate static site

## Important Implementation Notes

### Next.js 16 Async Params

Next.js 16 changed `params` to be a Promise. All dynamic route handlers must await params:

```tsx
export default async function Page({ params }: PageProps) {
  const { slug } = await params;  // Must await!
  // ...
}
```

### Static Export with Dynamic Routes

When using dynamic routes with static export, always set `dynamicParams = false`:

```tsx
export const dynamicParams = false; // Only generate paths from generateStaticParams()

export async function generateStaticParams() {
  // Return all paths to pre-render
}
```

This ensures that only statically generated paths are valid and non-existent paths return 404.

### Server Component redirect()

The `redirect()` function from `next/navigation` IS supported in Server Components during static export. It gets converted to client-side navigation automatically. This is different from config-based redirects in next.config.ts, which are NOT supported.

```tsx
// ✅ Supported in static export
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/blog');
}
```

### ESLint: setState in useEffect

The `TableOfContents.tsx` component has an ESLint disable comment for `react-hooks/set-state-in-effect` because DOM-based heading extraction is a legitimate use case for setState in useEffect.

### Commit Granularity

When committing changes, separate unrelated concerns into different commits. For example:
- ✅ Separate commits for: site name change, routing change, feature addition
- ❌ Single commit for: site name + routing + feature

## Custom Slash Commands

This project includes custom slash commands in `.claude/commands/`:

### `/commit`
Analyzes git changes and creates well-structured commits in Japanese with emojis. Automatically separates unrelated changes into different commits and follows conventional commit format.

### `/nextjs-fix`
Uses Next.js MCP (Model Context Protocol) server to validate code against Next.js best practices and official documentation. Checks for:
- Next.js 16 async API compliance
- Static export compatibility
- App Router patterns
- Performance best practices

### `/update-description`
Updates blog post descriptions automatically from the first paragraph content.

## SEO & Performance Optimizations

### SEO Features
- **robots.txt**: Search engine crawl control at `public/robots.txt`
- **sitemap.xml**: Dynamically generated at build time via `app/sitemap.ts`
- **OGP Images**: Dynamically generated via `app/opengraph-image.tsx` for social media previews
- **Structured Data**: JSON-LD BlogPosting schema via `components/JsonLd.tsx` for rich snippets
- **Metadata**: Comprehensive Open Graph and Twitter Card metadata in `app/layout.tsx`

### Performance Optimizations
- **Font Loading**: System font stack (no external font requests)
  - Stack: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
  - Zero network requests for fonts, instant text rendering
- **Image Optimization**: WebP format for all images (typically 60-70% size reduction)
  - Conversion script: `scripts/convert-to-webp.mjs`
- **Syntax Highlighting**: Local highlight.js (no CDN dependency)
- **Security Headers**: Comprehensive security headers in `public/_headers` (Cloudflare Pages)
  - Content-Security-Policy, X-Frame-Options, HSTS, etc.
  - Static asset caching (1 year for immutable assets)

### Image Workflow
1. Add images as PNG/JPEG to article directory
2. Run `node scripts/convert-to-webp.mjs` to convert to WebP
3. Update markdown references from `.png`/`.jpg` to `.webp`
4. Delete original PNG/JPEG files to reduce bundle size

## Deployment

The project is configured for Cloudflare Pages deployment:
- Build command: `npm run build`
- Output directory: `out`
- Includes Cloudflare Web Analytics (cookie-free, auto-enabled)
- Security headers automatically applied via `public/_headers`
- Requires `wrangler.jsonc` for deployment configuration

Also compatible with Vercel, Netlify, GitHub Pages, AWS S3, Firebase Hosting.
