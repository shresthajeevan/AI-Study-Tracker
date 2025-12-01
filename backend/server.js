import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allowed CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV === "production") return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));


// ======================
// HEALTH CHECK FIRST
// ======================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/uploadNotes", uploadRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/recommendations", recommendationRoutes);


// ======================
// STATIC FRONTEND (Render Deployment)
// ======================
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "public");

  // Serve Vue/React/Frontend build
  app.use(express.static(staticPath));

  // SPA fallback - catch all non-API routes and serve index.html
  app.use((req, res, next) => {
    // Let API routes pass through to 404 handler
    if (req.path.startsWith("/api") || req.path === "/health" || req.path.startsWith("/uploads")) {
      return next();
    }
    
    // For all other routes, serve the SPA index.html
    res.sendFile(path.join(staticPath, "index.html"), (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(500).json({ error: "Failed to load application" });
      }
    });
  });
} else {
  // Development root endpoint
  app.get("/", (req, res) => {
    res.json({ message: "AI Study Tracker API is running!" });
  });
}


// API 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});


// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});