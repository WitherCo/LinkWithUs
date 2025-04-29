# Witherco.xyz - Link in Bio Website

A modern, minimalist link-in-bio website similar to Linktree that allows users to create their own customizable link pages.

Developed by WitherCoDev.

## Features

- 🔗 Customizable profile links
- 👤 User profile customization
- 🌙 Dark mode/light mode toggle
- 📱 Mobile-responsive design
- 🔒 User authentication
- 📋 Link management (add, edit, delete)

## Tech Stack

- React.js
- TypeScript
- Tailwind CSS with shadcn/ui components
- Express.js backend
- PostgreSQL database with Drizzle ORM

## Getting Started

### Prerequisites

- Node.js (18.x or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/witherco-website.git
cd witherco-website
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```
DATABASE_URL=your_postgresql_connection_string
```

4. Run the development server
```bash
npm run dev
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Directory Structure

```
witherco-website/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── auth.ts            # Authentication logic
├── shared/                # Shared types and schemas
├── scripts/               # Deployment and utility scripts
└── .github/               # GitHub Actions workflows
```

## License

Copyright © 2023-2025 WitherCoDev. All Rights Reserved.

This project is proprietary software - see the LICENSE file for details.

## Contact

Email: wither@witherco.xyz