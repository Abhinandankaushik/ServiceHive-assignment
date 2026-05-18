import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import { errorHandler, notFound } from "./middleware/error";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") ?? "*",
    credentials: true,
  })
);
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
