import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

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

// Register routes
registerRoutes(app);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
