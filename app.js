var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const compression = require('compression');
var logger = require("morgan");
const cors = require("cors");
const config = require("./config/config");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const { errorConverter, errorHandler } = require("./middlewares/error");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
app.use(logger("dev"));

// parse json request body
app.use(express.json());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});


app.use(errorConverter);

app.use(errorHandler);

module.exports = app;
