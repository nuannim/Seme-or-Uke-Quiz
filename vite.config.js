import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Parse request URL
        const pathname = new URL(req.url, 'http://localhost').pathname;
        const filename = pathname.slice(1); // remove leading slash
        
        // Intercept requests for data JS files that are actually pure JSON
        // They live in the /data/ folder
        if (filename === 'data/qna.js' || filename === 'data/result.js' || filename === 'data/song.js') {
          const filePath = path.resolve(process.cwd(), 'public', filename);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(fs.readFileSync(filePath, 'utf-8'));
            return;
          }
        }
        next();
      });
    }
  }
});
