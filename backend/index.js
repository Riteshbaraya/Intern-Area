require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyparser = require("body-parser");
const { connect } = require("./db");
const router = require("./Routes/index");
const port = process.env.PORT || 5000;

// FIXED CORS: Only allow frontend and credentials
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Body parser middleware
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("hello this is internshala backend");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Backend server is running"
  });
});

app.use("/api", router);

// Connect to database (but don't block server startup)
try {
  connect();
} catch (error) {
  console.log("⚠️ Database connection failed, but server will continue running");
  console.log("💡 Some features may not work without database connection");
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`🌐 Health check: http://localhost:${port}/health`);
});
