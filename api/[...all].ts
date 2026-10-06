// Catch-all Vercel Function for every path under `/api/*`.
//
// Using a catch-all keeps the original request path intact (unlike a rewrite,
// whose destination path replaces the incoming path), so `/api/trpc/*` and
// `/api/oauth/*` reach the Express router unchanged. It shares the exact same
// application as `api/index.ts`.
export { default } from "./index";
