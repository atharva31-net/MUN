import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware (optional)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson.apply(this, [body, ...args]);
  };
res.on("finish", () => {
  if (path.startsWith("/api")) {
    const duration = Date.now() - start;
    let log = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) log += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    console.log(log.length > 80 ? log.slice(0, 79) + "…" : log);
  }
});
  next();
});

(async () => {
  // Register all your routes here
  await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    res.status(status).json({ message });
  });

  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log(Server listening on http://localhost:${port});
  });
})();
