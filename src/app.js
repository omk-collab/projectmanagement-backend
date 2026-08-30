import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import taskRouter from "./routes/task.routes.js";
import noteRouter from "./routes/note.routes.js";

import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

import { globalErrorHandler } from "./middlewares/global-error.middleware.js";

import {
  generalLimiter,
  authLimiter,
  emailLimiter,
  passwordResetLimiter,
} from "./middlewares/rate-limit.middleware.js";

const app = express();

// ========================================
// Basic Configuration
// ========================================

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

app.use(express.static("public"));

app.use(cookieParser());

// ========================================
// CORS Configuration
// ========================================

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

// ========================================
// General Rate Limiter
// ========================================

app.use("/api/v1", generalLimiter);

// ========================================
// Routes
// ========================================

app.use("/api/v1/healthcheck", healthCheckRouter);

// ========================================
// Authentication Routes
// ========================================

app.use("/api/v1/auth", authRouter);

// ========================================
// Project Routes
// ========================================

app.use("/api/v1/projects", projectRouter);

// ========================================
// Task Routes
// ========================================

app.use("/api/v1/tasks", taskRouter);

// ========================================
// Note Routes
// ========================================

app.use("/api/v1/notes", noteRouter);

// ========================================
// Home Route
// ========================================

app.get("/", (req, res) => {
  res.send("Welcome to basecampy");
});

// ========================================
// Global Error Handler
// ========================================

app.use(globalErrorHandler);

export default app;
