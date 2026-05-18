import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import { errorHandler, notFound } from "./middleware/error";
import { connectDB } from "./config/db";

const app: Application = express();

const allowedOrigins =
  process.env.CLIENT_URL?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow sibling Vercel frontend deployments when API is on a separate project
  if (/^https:\/\/[\w-]+\.vercel\.app$/i.test(origin)) return true;
  return allowedOrigins.length === 0;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) callback(null, true);
      else callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

// Ensure MongoDB is connected before API handlers (skip OPTIONS preflight)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS" || req.path === "/api/health") return next();
  connectDB().then(() => next()).catch(next);
});
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
