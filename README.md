This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Introduce structure

root
├── app/                      # Next.js app router (Next.js 13+)
│   ├── admin/                # Admin-specific pages
│   │   ├── layout.tsx        # Admin layout
│   │   └── page.tsx          # Admin dashboard  
│   │    
│   ├── customer/             # Customer-specific pages
│   │   ├── example           # Folder still name router
│   │   │   └── page.tsx      # explemple page ( like index)
│   │   ├── layout.tsx        # Customer layout
│   │   └── page.tsx          # Customer dashboard
│   ├── shared/               # Shared layouts and error pages
│   │   ├── ErrorBoundary.tsx        # Error boundary (error page)
│   │   ├── SharedLayout.tsx         # Shared layout
│   │   └── LoadingPage.tsx          # Loading page
│   └── middleware.ts         # Middleware for route protection
├── core/                     # Common resources and logic
│   ├── assets/               # Static assets (e.g., SVGs, logos)
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin-specific components
│   │   ├── customer/         # Customer-specific components
│   │   └── common/           # Shared components (e.g., buttons, modals)
│   ├── constants/            # Application constants or TypeScript types/interfaces
│   ├── hooks/                # Custom React hooks
│   ├── page/                 # Use components to create pages
│   │   ├── admin/            # Admin-specific pages
│   │   └── customer/        # Customer-specific pages
│   ├── services/   
│   │   ├── example/          # Example services (share for each service backend)
│   │   └── exampleService.ts      # Data-fetching and API logic example
│   └── utils/                # Utilities
│       └── apiPath.ts        # API path generator
├── .env                      # Environment variables
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies
└── README.md                 # Documentation
