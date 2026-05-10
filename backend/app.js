require("dotenv").config();
const cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

app.use(cors());

const db = require("./config/db");
const startPlanCleanup = require("./tasks/plan-cleanup");

const port = process.env.PORT || 3000;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var plansRouter = require("./routes/plans");
var plansRequestRouter = require("./routes/plans-request");
var adminRouter = require("./routes/admin");
var contactRouter = require("./routes/contact");
var exerciseTutorialsRouter = require("./routes/exercise-tutorials");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/plans", plansRouter);
app.use("/plans-request", plansRequestRouter);
app.use("/admin", adminRouter);
app.use("/contact", contactRouter);
app.use("/exercise-tutorials", exerciseTutorialsRouter);

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

startPlanCleanup();

module.exports = app;
