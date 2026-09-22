import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(`[Global Error Interceptor]: ${err.stack}`);
  res
    .status(500)
    .json({ success: false, error: "Internal Server Processing Error" });
});

export default app;
