# EduCenter - Africa's Practical Learning Engine

Part of the BoldMind monorepo ecosystem.

## Overview

EduCenter is a comprehensive learning platform with three core pillars:

1. **Study Hub** - JAMB/WAEC/NECO past questions + CBT mastery
2. **Digital Business School** - Content funnels, automation & sales playbooks for Nigerian SMEs  
3. **AI Skills Lab** - Practical AI tools for creators and entrepreneurs

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)

### Backend (NestJS)
- **NestJS** API Gateway
- **MongoDB** (User data, progress tracking)
- **Mongoose** ODM
- **Firebase Auth** (via @boldmind/auth)
- **Paystack** (Payments)

### Shared Packages
- `@boldmind-tech/ui` - Shared UI components
- `@boldmind-tech/auth` - Firebase authentication
- `@boldmind-tech/utils` - Helper functions
- `@boldmind-tech/payments` - Paystack integration
- `@boldmind-tech/api-client` - HTTP client

## Project Structure

```
apps/web/educenter/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── study-hub/
│   │   │   ├── page.tsx
│   │   │   ├── subjects/page.tsx
│   │   │   ├── practice/[subject]/[year]/page.tsx
│   │   │   └── performance/page.tsx
│   │   ├── business-school/
│   │   │   ├── page.tsx
│   │   │   └── courses/page.tsx
│   │   ├── ai-lab/
│   │   │   ├── page.tsx
│   │   │   └── tools/page.tsx
│   │   └── subscription/page.tsx
│   ├── page.tsx (Landing)
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── lib/
│   ├── config.ts
│   ├── api.ts
│   ├── firebase.ts
│   └── hooks/
│       └── useAuth.ts
├── components/
├── public/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local.example
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (for monorepo)
- MongoDB running locally or Atlas account
- Firebase project
- Paystack account

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Past Questions
NEXT_PUBLIC_ALOC_ACCESS_TOKEN=your_aloc_token

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

### 2. Install Dependencies

From monorepo root:

```bash
pnpm install
```

### 3. Start Development Server

```bash
# Frontend (from root)
pnpm --filter @boldmind/educenter dev

# Backend (from root)
pnpm --filter @boldmind/api-gateway dev
```

Or from app directory:

```bash
cd apps/web/educenter
pnpm dev
```

App will run on `http://localhost:3001`

### 4. Backend Setup

```bash
cd services/api-gateway

# Copy env file
cp .env.example .env

# Install dependencies
pnpm install

# Start backend
pnpm start:dev
```

Backend will run on `http://localhost:4000`

## Features

### Study Hub
- ✅ 10,000+ JAMB/WAEC/NECO past questions
- ✅ Subject-based practice
- ✅ CBT simulation mode
- ✅ Performance tracking & analytics
- ✅ Study streak system
- ✅ Random practice (5 daily attempts for free users)
- ✅ Leaderboard

### Digital Business School
- 🚧 Course library (free & paid)
- 🚧 Sales funnel templates
- 🚧 WhatsApp automation guides
- 🚧 Marketing playbooks
- 🚧 Expert-led masterclasses
- 🚧 Community access

### AI Skills Lab
- 🚧 AI video generation
- 🚧 Prompt engineering course
- 🚧 WhatsApp AI automation
- 🚧 Content creation suite
- 🚧 AI tools marketplace

## Subscription Plans

### Study Hub
- **6 Months**: ₦700
- **1 Year**: ₦1,000

### Digital Business School
- **Lifetime**: ₦1,000 (one-time payment)

### AI Skills Lab
- **Lifetime**: ₦1,000 (one-time payment)

## API Integration

### Past Questions API (ALOC)

```typescript
import { pastQuestionsAPI } from '@/lib/api';

// Get all questions for a subject/year
const questions = await pastQuestionsAPI.getAllQuestions('mathematics', '2020');

// Get random question
const randomQ = await pastQuestionsAPI.getRandomQuestion('english', '2019');
```

### BoldMind API

```typescript
import { boldMindAPI } from '@/lib/api';

// Save progress
await boldMindAPI.saveProgress({
  uid: user.uid,
  subject: 'physics',
  year: '2021',
  questionId: 'q123',
  answer: 'A',
  isCorrect: true,
  timeSpent: 45,
});

// Get user progress
const progress = await boldMindAPI.getProgress(user.uid);
```

## Deployment

### Frontend (Vercel)

```bash
# Build
pnpm build

# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Render)

```bash
cd services/api-gateway
pnpm build
pnpm start:prod
```

## Contributing

1. Create feature branch from `main`
2. Make changes
3. Run tests: `pnpm test`
4. Submit PR

## License

Part of BoldMind ecosystem. All rights reserved.

## Support

For issues or questions:
- Email: support@boldmind.ng
- Docs: https://docs.boldmind.ng/educenter