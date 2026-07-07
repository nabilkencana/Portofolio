import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── Local Upload Plugin ─────────────────────────────────────────────
// Handles POST /api/upload-local during Vite dev server.
// Saves image directly into src/assets/<folder>/ and public/<folder>/
// so it is both persisted in the repo and immediately servable as a URL.
//
// Request body JSON:
//   { filename: string, data: base64DataUrl, folder: "gallery"|"projects"|"certificate" }
//
// Response JSON:
//   { url: "/<folder>/<filename>" }
function localUploadPlugin() {
  return {
    name: "local-upload-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "POST" || req.url !== "/api/upload-local") {
          return next();
        }

        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", () => {
          try {
            const { filename, data, folder = "gallery" } = JSON.parse(body);

            // Strip the base64 header
            const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            // 1. Save into src/assets/<folder>/ — persisted in workspace
            const assetsDir = join(process.cwd(), "src", "assets", folder);
            mkdirSync(assetsDir, { recursive: true });
            writeFileSync(join(assetsDir, filename), buffer);

            // 2. Save into public/<folder>/ — immediately served as static URL
            const publicDir = join(process.cwd(), "public", folder);
            mkdirSync(publicDir, { recursive: true });
            writeFileSync(join(publicDir, filename), buffer);

            const url = `/${folder}/${filename}`;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ url }));
          } catch (err) {
            console.error("[local-upload] Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Upload failed" }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localUploadPlugin()],
});
