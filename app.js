const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
const auth = require("./routes/auth.js");

const PORT = process.env.PORT || 3000;

var indexRouter = require("./routes/index");

const app = express();
// view engine setup
app.engine(
  "hbs",
  hbs({
    layoutsDir: "views/layout",
    defaultLayout: "main",
    extname: "hbs",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.listen(PORT, console.log(`Server running on port ${PORT}`));
