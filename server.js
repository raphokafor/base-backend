require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT_EXCEPTION_ERROR_WILL_CRASH");
  console.log(err.name, err.message);

  // graceful shutdown
  process.exit(1);
});

// connect to mongo
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log("database connection err: ", err));

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED_REJECTION_ERROR_WILL_CRASH");
  console.log(err.name, err.message);

  // graceful shutdown
  server(() => {
    process.exit(1);
  });
});
