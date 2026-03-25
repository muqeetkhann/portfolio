# Muhammad Muqeet Khan — Portfolio

Dark & modern Next.js portfolio with Lenis smooth scroll and Framer Motion animations.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

> Requires Node.js 18+. Check with `node -v`.

---

## ✏️ Update Your Content

Everything is in **`lib/data.ts`** — one file for all your info:
- Personal details, email, GitHub, LinkedIn
- Work experience
- Projects (add/remove/edit)
- Skills

### Add a project
```ts
{
  id:       12,
  title:    'My Project',
  type:     'SaaS Platform',
  url:      'https://myproject.com',
  urlLabel: 'myproject.com',
  cat:      'saas',           // saas | web3 | ecom | site
  accent:   '#6EE7B7',
  num:      '12',
  desc:     'Short description here.',
  highlights: ['Point 1', 'Point 2', 'Point 3'],
  tags:     ['React', 'Next.js'],
}
```

---

## 📁 Structure

```
mkportfolio/
├── app/
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── page.tsx          # Assembles all sections
│   └── globals.css       # Global styles
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   ├── Cursor.tsx        # Custom cursor with lag effect
│   ├── FadeIn.tsx        # Scroll-triggered framer-motion fade
│   ├── Footer.tsx
│   ├── MeshBackground.tsx # Animated gradient mesh
│   ├── Navbar.tsx
│   ├── SectionTitle.tsx
│   └── SmoothScroll.tsx  # Lenis smooth scroll
├── lib/
│   └── data.ts           # ⭐ ALL CONTENT HERE
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## 🌐 Deploy Free on Vercel

1. Push folder to GitHub
2. Go to vercel.com → New Project → Import repo
3. Deploy — live in 60 seconds

---

## 🐛 Common Issues

**`Module not found: @studio-freight/lenis`**
→ Run `npm install` again

**Cursor not showing**
→ Normal on touch devices. Works on desktop only.

**Fonts not loading**
→ Needs internet connection for Google Fonts on first run.
