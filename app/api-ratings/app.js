var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var async = require("async");
const mongoose = require("mongoose");

var URI = process.env.MONGODB_URI;

var Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId;

var app = express();

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require("./models/mongo/subject");
require("./models/mongo/rating");

var Subject = mongoose.model("Subject");
var Rating = mongoose.model("Rating");

var connectOptions = {
  useMongoClient: true,
  autoIndex: false
};

mongoose.Promise = require("bluebird");

const reconnectTimeout = 10000; // ms.

function connect() {
  mongoose.connect(URI, connectOptions).catch(() => {});
}

// make sure your connected
// the writings on the wall

const db = mongoose.connection;

db.on("connecting", () => {
  console.info(`connecting to DB @ `, URI);
});

db.on("error", error => {
  console.error(`connection error: ${error}`);
  mongoose.disconnect();
});

db.on("connected", () => {
  console.info(`connected`);
});

db.once("open", () => {
  console.info(`connection opened!`);
});

db.on("reconnected", () => {
  console.info(`db reconnected!`);
});

db.on("disconnected", () => {
  console.error(
    `db disconnected! reconnecting in ${reconnectTimeout / 1000}s...`
  );
  setTimeout(() => connect(), reconnectTimeout);
});

connect();

var mongo = require("./routes/mongo");
var index = require("./routes/index");

app.use("/", index);
app.use("/api", mongo);

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
