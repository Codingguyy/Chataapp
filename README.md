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

## Local configuration

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set real values:
   - `MONGODB_URI`: your MongoDB connection string.
   - `JWT_SECRET`: a random secret with at least 32 characters.
   - `SOCKET_PORT`: WebSocket server port (default `8080`).
   - `NEXT_PUBLIC_SOCKET_URL`: `ws://localhost:8080` for local development.

3. Start the Next.js app in one terminal:

   ```bash
   npm run dev
   ```

4. Start the WebSocket server in a second terminal:

   ```bash
   npm run socket
   ```

For production, set the same server-side environment variables in the hosting environment and set `NEXT_PUBLIC_SOCKET_URL` to the public `wss://` WebSocket endpoint. The WebSocket process must be hosted on a platform that supports persistent WebSocket connections; a standard serverless Next.js function is not a replacement for this process.

**Security:** The previous source contained a hardcoded MongoDB connection string and a hardcoded JWT signing secret. Rotate the exposed MongoDB password and use a new random `JWT_SECRET`; do not reuse either exposed value.
