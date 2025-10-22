import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import dbConnection from "./utils/index.js";
import cookieParser from "cookie-parser";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js"
import { fileURLToPath } from "url";
import path from "path";
import nodemailer from "nodemailer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dbConnection();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ["https://maison-sommeil.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Cache control
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// API Routes
app.use("/api", routes);

// Serve static files from React build
const frontendPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all MUST be a regular function, not with "*"
app.use((req, res, next) => {
  // Only send index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, "index.html"));
  } else {
    next();
  }
});

// Error handlers (must be last)
app.use(routeNotFound);
app.use(errorHandler);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Mailgun Test" <${process.env.EMAIL_USER}>`,
      to: "YOUR_PERSONAL_EMAIL@gmail.com",
      subject: "Mailgun SMTP Test ✔️",
      text: "If you got this, your Render server can send emails!",
    });

    res.send("✅ Test email sent successfully!");
  } catch (err) {
    console.error("❌ Error sending test email:", err);
    res.status(500).send(`Error: ${err.message}`);
  }
});

// Start server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));