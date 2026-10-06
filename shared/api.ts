import type { AppRouter } from "../server/routers";

// Public API surface shared between the client and the server. This is a
// type-only re-export, so it is erased at build time and never pulls server
// runtime code into the client bundle.
export type { AppRouter };
