import type { IncomingMessage, ServerResponse } from "node:http";
import type { Request, Response } from "express";
import { createApp } from "../server/_core/app";

const app = createApp();

/**
 * Vercel Function entry point.
 *
 * The Express application is exported as a Node `(request, response)` handler
 * so Vercel's Node.js runtime invokes it directly. Request paths are preserved,
 * so `/api/trpc`, `/api/oauth`, `/healthz`, and `/manus-storage` all resolve
 * inside Express. Static assets and the SPA are served by Vercel from
 * `dist/public` (see `vercel.json`).
 */
export default function handler(
  request: IncomingMessage,
  response: ServerResponse
): void {
  app(request as Request, response as Response);
}
