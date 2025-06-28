import express, { Request, Response, NextFunction } from "express";
import routes from "./routes";

const app = express();

// Middleware: Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware: Custom API logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      console.log(logLine);
    }
  });

  next();
});

// Route mounting
app.use("/", routes);

// Error handler (safe logging)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("❌ Unhandled Error:", err); // Safely log the error
  res.status(status).json({ message });
});

// ✅ FIXED: Cast port to number
const port = Number(process.env.PORT) || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
