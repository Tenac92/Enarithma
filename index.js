const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS configuration: Allow all origins (use in development or open environments)
app.use(cors()); // Simple version that allows all origins

// Optional: Restrict CORS to specific origins in production or for additional security
const corsOptions = {
  origin: ["http://localhost:3000", "https://yourfrontenddomain.com"], // List of allowed domains
  methods: ["GET", "POST", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions)); // Apply the CORS configuration

// Custom header handling (e.g., for user ID tracking)
app.use((req, res, next) => {
  const userId = req.headers["x-replit-user-id"]; // Case-insensitive header name
  if (userId) {
    console.log("User ID:", userId); // Log or use the userId as necessary
    // Optional: Save userId to a session or database
  }
  next(); // Proceed to the next middleware
});

// Import and use CRUD routes (ensure these files exist and are set up correctly)
const crudRoutes = require("./backend/crud.js");
app.use("/enarithma", crudRoutes);

// Import and use User routes (ensure these files exist and are set up correctly)
const userRoutes = require("./backend/users.js");
app.use("/users", userRoutes);

// Serve static files (ensure 'public' directory exists and contains necessary assets)
app.use(express.static(path.join(__dirname, "public")));

// Default route for the API, serving the front-end (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html")); // Ensure 'public' folder is correct
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
