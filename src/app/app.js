const express=require("express");
const { dirname } = require("path");
const app=express();
const config=require("config");
app.use(express.json());
app.use("/asset/uploads/images", express.static(config.get("app.baseImageUrl")));

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//config cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//config redis
const {connectionRedis} = require("../common/init.redis");
connectionRedis();
module.exports = app;

app.use(config.get("app.prefixApiVersion"),require(`${__dirname}/../routers/web`));
