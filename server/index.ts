import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handler for everything not matched by express.static.
  app.use((req, res) => {
    // A request that looks like a file (has an extension) must NOT receive
    // index.html — otherwise a missing image/script is returned as HTML with a
    // 200, which browsers silently render as a broken resource. Return a real 404.
    const looksLikeAsset = path.extname(req.path) !== "";
    if (looksLikeAsset || req.method !== "GET") {
      res.status(404).send("Not found");
      return;
    }

    // Otherwise serve the SPA shell so client-side routes survive a refresh.
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
