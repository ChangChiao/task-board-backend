var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const compression = require('compression');
var logger = require("morgan");
const cors = require("cors");
const passport = require('passport');
const config = require("./config/config");
const { jwtStrategy } = require('./config/passport');
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const { errorConverter, errorHandler } = require("./middlewares/error");
const routes = require('./routes');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user.route");

require("./services/scheduling");

var app = express();
app.use(logger("dev"));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

app.use(passport.initialize());
console.log('passssss', jwtStrategy);
passport.use('jwt', jwtStrategy);



app.use('/v1', routes);


app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});



app.use(errorConverter);

app.use(errorHandler);

module.exports = app;
