const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./app/index/router");
const authenticationRouter = require("./app/authentication/router");
const budgetRouter = require("./app/budget/router");
const expenseRouter = require("./app/expense/router");

const app = express();

// const allowedOrigins = ["*"];
// // Middleware CORS untuk mengizinkan asal yang diizinkan
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true); // Izinkan asal yang diizinkan
//       } else {
//         callback(new Error("Origin not allowed by CORS")); // Tolak asal yang tidak diizinkan
//       }
//     },
//   })
// );

app.use(
  cors({
    origin: "*",
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/authentication", authenticationRouter);
app.use("/budget", budgetRouter);
app.use("/expense", expenseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
