// import modules
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// import routes
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location");

// initialize express
const app = express();

// global application middlewares (must be on top of route middle wares)
// sey security headers
app.use(helmet());

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // dev tools
}

// limit ip reqs for hr
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});
app.use("/api", limiter);

// handling calls
app.use(cors());

// body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// data sanitization against nosql query injection
app.use(mongoSanitize());

// data sanitization against xss
app.use(xss());

// prevent param pollution
app.use(hpp()); // fields that need to be queried multi times in endpoint can be whitelisted i.e hpp({ whitelist: ['duration', 'rating'] })

// route middlewares
// the '/api' is default base for all routes from 'userRoutes'
app.use("/api", locationRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// this middleware will only be reached if the above api routes dont match (handles all unhandled routes)
app.all("*", (req, res, next) => {
  next(new AppError(`Endpoint ${req.originalUrl} does not exist.`, 404));
});

// global catch all errors from next(error) middleware
app.use(globalErrorHandler);

module.exports = app;
