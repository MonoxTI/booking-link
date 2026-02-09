import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./Routes/Route.js";
import connectDB from "./Config/DBconnect.js";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const app = express();
const PORT = process.env.PORT || 5000;

// Flexible CORS for development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5174',
  'assembledbookings.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

connectDB();

app.use("/api", router);

// Catch-all for 404
app.use((req, res) => {
  console.log("Unhandled route:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` Allowed origins: ${allowedOrigins.join(', ')}`);
});

process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err);
  process.exit(1);
});