import express from "express";
import cors from "cors";
import multer from "multer";
import cloudinary from "./utils/cloudinary.js"
import fs from "fs";
import morgan from "morgan";
import dotenv from "dotenv";
import dbConnection from "./utils/index.js";
import cookieParser from "cookie-parser";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js"
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dbConnection();

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' }); // Temporary upload dir

const corsOptions = {
  origin: ["https://mavraudercollections.netlify.app","http://localhost:4000","https://maison-sommeil.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware - MUST come before routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Cache control middleware
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Upload route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      upload_preset: "61f1d441-2062-411e-ac0f-8ea501b356f0",
    });

    fs.unlinkSync(filePath);

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// API Routes
app.use("/api", routes);

// Serve static files from React build
const frontendPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all route for React Router (MUST be after API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handlers (MUST be last)
app.use(routeNotFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));