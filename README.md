# Nexus Web Experience (Next.js)

A clean, modern landing page built with Next.js 14+ and TypeScript, focused on high-quality UX, fast performance, and smooth scrolling interactions.

## 🚀 Project Overview

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: CSS Modules / global CSS
- Architecture: component-based sections under `app/components`
- Purpose: professionally styled corporate or product landing page with hero, features, manifesto, and call-to-action

## 📁 Repository Structure

- `app/`
  - `layout.tsx` – application layout and metadata
  - `page.tsx` – entry point for the landing page
  - `globals.css` – global styles and utility CSS
  - `components/` – reusable UI sections:
    - `HeroSection.tsx`, `ProblemSection.tsx`, `TechnologySection.tsx`, `ExperienceSection.tsx`, `ConvergenceSection.tsx`, `ManifestoSection.tsx`, `InvitationSection.tsx`, `SmoothScroll.tsx`

- `public/` – static assets and images

## 🛠️ Local Development

1. Install dependencies:

```bash
npm install
# or yarn
# or pnpm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open browser at `http://localhost:3000`

4. Live-edit UI by modifying `app/page.tsx` or files under `app/components`

## ✅ Available Scripts

- `npm run dev` - start Next.js in development mode
- `npm run build` - production build
- `npm run start` - run built app
- `npm run lint` - run TypeScript + ESLint checks (if configured)

## 🧩 Key Features

- Fast SSR/SSG by default with Next.js app routes
- Component section-based UI for easy edit/maintenance
- Responsive design support out of the box
- Smooth scrolling helper in `SmoothScroll.tsx`
- Simple upgrade path to custom content + animations

## 🛡️ Production Deployment

1. Build app:

```bash
npm run build
```

2. Run production preview locally:

```bash
npm start
```

3. Deploy to Vercel (recommended) or any Node host that supports Next.js.

## 🔧 How to Customize

- Update branding colors and typography in `app/globals.css`
- Change copy and section order in `app/page.tsx`
- Add or modify content components in `app/components/`
- Extend with data-driven sections (Markdown/JSON/API) as needed

## 🧪 Testing and Quality

- Add unit or component tests with `Vitest`/`Jest` in future iterations
- Maintain accessibility using semantic HTML and contrast-friendly styles

## 📘 Resources

- Next.js docs: https://nextjs.org/docs
- TypeScript guide: https://www.typescriptlang.org/docs/
- Vercel deployment: https://vercel.com/docs/concepts/deployments/overview

---

_Created by the Farouk-studio._
