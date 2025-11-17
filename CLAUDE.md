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
- Server Components, API Routes, Middleware, Image Optimization, and ISR are **not available**
- Images must use `unoptimized: true` in next.config.ts

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
   - `remarkRehype` → convert to HTML AST
   - `rehypeSlug` → add IDs to headings (for table of contents anchor links)
   - `rehypeHighlight` → apply syntax highlighting to code blocks
   - `rehypeStringify` → convert to HTML string
4. **Cache**: Wrapped with React `cache()` to prevent duplicate processing within the same render

**Key Functions:**
- `getAllPosts()`: Returns all post metadata (sorted by date, newest first) - used for blog listing
- `getAllPostSlugs()`: Returns array of slugs - used for `generateStaticParams()`
- `getPostBySlug(slug)`: Returns full post data including HTML content - used for article detail pages

### Routing Structure

- `/blog` - Article listing page (app/blog/page.tsx)
- `/blog/[slug]` - Article detail pages (app/blog/[slug]/page.tsx)

The `[slug]` dynamic route uses `generateStaticParams()` to pre-render all articles at build time.

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
- Blog listing (`app/blog/page.tsx`)
- Article detail pages (`app/blog/[slug]/page.tsx`)

### Table of Contents

Article detail pages include a client-side table of contents (`components/TableOfContents.tsx`) that:
- Extracts h2/h3 headings from the article DOM after mount
- Displays in a sticky sidebar on XL+ screens (`hidden xl:block w-64 shrink-0`)
- Uses `rehypeSlug` to ensure headings have IDs for anchor links
- Scroll offset configured with `scroll-mt-8` on headings

### Typography and Styling

Articles use Tailwind Typography (`@tailwindcss/typography`) with extensive customization:
- Code blocks: `prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-1`
- Inline code: `prose-code:text-pink-600 prose-code:bg-gray-100`
- Headings: `prose-h2:scroll-mt-8` for proper anchor link scrolling
- Syntax highlighting: GitHub Dark theme via highlight.js CDN

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
3. Add images to the same directory
4. Reference images with relative paths: `![alt](./image.png)`
5. Run `npm run build` to regenerate static site

## Important Implementation Notes

### Next.js 16 Async Params

Next.js 16 changed `params` to be a Promise. All dynamic route handlers must await params:

```tsx
export default async function Page({ params }: PageProps) {
  const { slug } = await params;  // Must await!
  // ...
}
```

### ESLint: setState in useEffect

The `TableOfContents.tsx` component has an ESLint disable comment for `react-hooks/set-state-in-effect` because DOM-based heading extraction is a legitimate use case for setState in useEffect.

### Commit Granularity

When committing changes, separate unrelated concerns into different commits. For example:
- ✅ Separate commits for: site name change, routing change, feature addition
- ❌ Single commit for: site name + routing + feature

## Deployment

The project is configured for Cloudflare Pages deployment:
- Build command: `npm run build`
- Output directory: `out`
- Includes Cloudflare Web Analytics (cookie-free, auto-enabled)

Also compatible with Vercel, Netlify, GitHub Pages, AWS S3, Firebase Hosting.
