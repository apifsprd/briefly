# Briefly 📰

**Briefly** is a high-performance, minimalist news aggregator built with the latest React and Next.js ecosystem. Unlike traditional aggregators that scrape content, Briefly adheres to an **Ethical Extraction Policy**, only fetching data from official RSS feeds provided by news organizations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Version](https://img.shields.io/badge/version-0.6.1--beta-orange)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

---

## 🌟 Philosophy

In an era of information overload and content piracy, Briefly aims to:

1. **Respect Publishers** — Only using official RSS distribution channels, never scraping.
2. **Speed-First Experience** — Leveraging React 19 Server Components for near-instant load times.
3. **Reader Focus** — A clean, typography-centric design using **Poppins** for UI and **Lora** for body text.

---

## 🚀 Tech Stack

| Category          | Technology                                             |
| ----------------- | ------------------------------------------------------ |
| **Framework**     | [Next.js 16](https://nextjs.org/) (App Router)         |
| **Library**       | [React 19](https://react.dev/) (with React Compiler)   |
| **Styling**       | [Tailwind CSS v4](https://tailwindcss.com/)            |
| **Language**      | [TypeScript 5](https://www.typescriptlang.org/)        |
| **Feed Parsing**  | [rss-parser](https://www.npmjs.com/package/rss-parser) |
| **Date Handling** | [Day.js](https://day.js.org/)                          |
| **Icons**         | [Lucide React](https://lucide.dev/)                    |
| **Comments**      | [Giscus](https://giscus.app/) (GitHub Discussions)     |
| **Linter**        | [ESLint 9](https://eslint.org/)                        |

---

## ✨ Features

- 📡 **RSS-Based Aggregation** — Pulls content from official publisher feeds only
- ⚡ **Server-Side Rendering** — Fast initial load via Next.js App Router
- 💬 **Comment System** — Powered by Giscus (GitHub Discussions), no extra backend needed
- 🕐 **Human-Friendly Timestamps** — Relative time formatting with Day.js
- 🧹 **Minimal UI** — Distraction-free reading experience
- 🌙 **Ethical by Design** — No scraping, no paywalled content extraction

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 18.x
- **npm**, **yarn**, or **pnpm**

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/briefly.git
cd briefly

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feat/your-feature`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) standard for commit messages.

---

## � Adding RSS Feeds

Want to contribute a new RSS feed to Briefly? Great! Please ensure the following requirements are met:

### Requirements

1. **Official Source Only** — The RSS feed must come directly from the news organization or publisher. Third-party aggregators or unofficial feeds are **not accepted**.

2. **Date Information** — The feed items must contain **either**:
   - `isoDate` — Already in ISO 8601 format (e.g., `2026-05-14T10:30:00.000Z`)
   - `pubDate` — With timezone information (e.g., `Mon, 14 May 2026 10:30:00 GMT`)

3. **Quality Content** — The feed should provide meaningful article titles, descriptions, and links back to the original content.

### How to Add

1. Locate the RSS feed URL from the official news organization
2. Add the feed to `data/rss.json` under the appropriate category
3. Test the feed to ensure it parses correctly
4. Submit a Pull Request with details about the feed source

---

## 💝 Support This Project

If you find Briefly useful and want to support its development, consider making a donation:

**[Donate via PayPal](https://paypal.me/apifsprd)**

Your support helps maintain this project and keep it free and open-source for everyone.

---

## �📜 Ethical Extraction Policy

Briefly is built on the principle that **content creators deserve respect**. This means:

- ✅ Only fetching data from **official RSS/Atom feeds**
- ✅ Always linking back to the **original article**
- ✅ Never storing full article content in a database
- ❌ Never scraping HTML from publisher websites
- ❌ Never bypassing paywalls or access restrictions

If a publisher does not provide an RSS feed, their content will **not** be included.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ and ☕ · <a href="https://github.com/your-username/briefly">GitHub</a>
</p>
