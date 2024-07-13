const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

// error handling files
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");

// Express
const app = express();
// enable Cors
app.use(cors());
app.options("*", cors());
//use compression
app.use(compression());

// Database
dotenv.config({ path: "config.env" });
const dbConfig = require("./config/database");

// routes
const mountRoutes = require("./routes");
// Database Connection
dbConfig();

// additional middlewares
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

// limit the number of requests for user auth
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  skipSuccessfulRequests: true,
});
app.use("/api/v1/auth", limiter);

// Mount Routes
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Task Manager API" });
});

mountRoutes(app);

// handling Unhandled routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 401));
});

// Global error handling middleware for express
app.use(globalError);

// Starting the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//  Handle rejection outside Express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
