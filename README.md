<div align="center">
  <img src="public/logo.png" alt="FluxUI Logo" width="120" />
  <h1>FluxUI</h1>
  <p><strong>Generated High-Quality Free UI/UX Mobile and Web Designs with AI</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.1-C5F74F?style=flat-square)](https://orm.drizzle.team/)
</div>

<hr />

## 🚀 About FluxUI

FluxUI is an intelligent UI/UX generation platform powered by AI. It allows developers and designers to quickly scaffold, iterate, and generate code for modern mobile and web interfaces. Built on the modern Next.js App Router, FluxUI utilizes large language models (via OpenRouter and OpenAI) to translate natural language prompts into stunning, functional React UI components rendered in a fully interactive canvas.

## ✨ Key Features

- **🪄 AI-Powered Generation:** Instantly generate complete screens, individual components, or overarching project configurations using natural language prompts.
- **🎨 Interactive Canvas Workspace:** A fully draggable, resizable, and zoomable visual workspace powered by `react-rnd`, `react-resizable-panels`, and `react-zoom-pan-pinch`.
- **🔐 Secure Authentication:** Seamless user onboarding and session management using Clerk.
- **🪙 Credit System:** Built-in credit tracking mechanism for AI generation limits and usage.
- **💾 Real-Time Project Saving:** Save themes, configs, device profiles, and generated code safely to a PostgreSQL database via Drizzle ORM.
- **🧩 Shadcn UI & Tailwind v4:** High-quality, accessible UI primitives styled with the latest Tailwind CSS engine.
- **📸 Screenshot Engine:** Instantly capture and export generated designs leveraging `html2canvas`.

---

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Radix UI, Shadcn UI
- **Icons & Typography:** HugeIcons, Lucide React, Geist/Figtree/DM Sans

### Data & State
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **State Management:** React Context (`RefreshDataContext`, `SettingContext`, `UserDetailContext`)

### Integrations
- **Authentication:** Clerk (`@clerk/nextjs`)
- **AI/LLM:** OpenAI, OpenRouter SDK

---

## 📂 Project Structure

```text
fluxui/
├── app/
│   ├── (auth)/             # Clerk Sign-In & Sign-Up Routes
│   ├── api/                # Next.js API Routes (AI Generation, DB ops, Configs)
│   ├── project/[projectId] # Interactive Project Workspace & Canvas
│   ├── pricing/            # Subscription & Credit Purchasing
│   ├── projects/           # User's Project Dashboard
│   └── _shared/            # Global/Shared UI components (Hero, Header, etc.)
├── components/
│   └── ui/                 # Reusable Shadcn UI & Radix components
├── config/                 # Drizzle Database Connection & Schema models
├── context/                # React Context Providers for global state
├── data/                   # Constants, Prompts, and Themes definitions
├── public/                 # Static assets (Logos, SVGs)
└── ...
```

---

## 🗄️ Database Schema Overview

The application utilizes a robust relational schema structured via Drizzle ORM:
- **`users`**: Manages user identities, emails, and generation `credits`.
- **`projects`**: Stores high-level project data including `projectId`, `theme`, `device`, `userInput`, and base `config`.
- **`screenConfig`**: Holds specific AI-generated code (`code`), UI hierarchy (`screenDescription`), and structural details linked to a parent project.

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18.17+ recommended)
- npm, yarn, pnpm, or bun
- A PostgreSQL Database (e.g., [Neon](https://neon.tech/))
- [Clerk](https://clerk.dev/) Account (for Authentication)
- OpenAI / OpenRouter API Keys

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/fluxui.git
cd fluxui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` or `.env.local` file in the root of your project and configure the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host/dbname"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# AI Services
OPENAI_API_KEY="your_openai_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key"
```

### 4. Database Setup

Push the Drizzle schema to your connected database:

```bash
npm run db:push
# or use drizzle-kit directly if scripts aren't defined
npx drizzle-kit push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
## 🎥 Demo Video
[▶ Watch Full Demo on Loom](https://www.loom.com/share/8472ba8f90f241e5892b3397589957e1)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
