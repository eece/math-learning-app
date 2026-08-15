# Math Learning App 🧮

A fun, multi-language math teaching application for kids (and adults!).

**Tech stack:** React + Vite + Tailwind CSS + react-i18next

## Features

- **User onboarding**: Enter your name on first visit. Stored in `localStorage`.
- **Multi-language (i18n)**: Turkish 🇹🇷, English 🇬🇧, German 🇩🇪
- **Modules**:
  - ✅ **Multiplication Tables** (1–10) – Learn mode + Practice mode with scoring & stars
  - 🔜 Addition
  - 🔜 Subtraction
  - 🔜 Division
  - 🔜 Four Operations

### Multiplication Module
- Select individual tables (1–10) or practice all mixed
- **Learn**: Beautiful full tables
- **Practice**: 10 random questions, instant feedback, score tracking
- Progress & stars (1–3) saved per table in localStorage

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── Welcome.jsx
│   ├── Home.jsx
│   ├── MultiplicationModule.jsx
│   └── LanguageSwitcher.jsx
├── hooks/
│   └── useUser.js          # localStorage user + progress
├── i18n/
│   └── index.js
├── locales/
│   ├── en.json
│   ├── tr.json
│   └── de.json
├── App.jsx
├── main.jsx
└── index.css
```

## Data stored in localStorage

- `mathApp_user` → name, progress (stars, scores per table)
- `mathApp_language` → selected language

## Future plans

- Addition, Subtraction, Division modules
- Four operations mixed practice
- More advanced levels / difficulty
- Sound effects & more animations
- Parent / teacher dashboard (optional)

---

Made with ❤️ for learning math the fun way.
