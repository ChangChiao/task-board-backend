var express = require("express");
var path = require("path");
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


var app = express();
app.use(logger("dev"));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

// gzip compression
app.use(compression());

const allowedOrigins = ["https://task-board-theta.vercel.app", "http://localhost:3000"]

// enable cors
const corsOptions = {
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    console.log("origin", origin)
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "x-csrf-token", "Content-Type", "Accept", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options(config.frontEnd, cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);



app.use('/v1', routes);


app.get('/', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')});
})

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});



app.use(errorConverter);

app.use(errorHandler);

module.exports = app;
