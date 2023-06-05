const http = require("http");
const logger = require("tracer").colorConsole();
require("dotenv").config();
const imageRouter = require("./app/imageRouter");
const tagsRouter = require("./app/tagsRouter");
const filtersRouter = require("./app/filtersRouter");
const userRouter = require("./app/userRouter");
http
  .createServer(async (req, res) => {
    if (req.url.search("/photos") != -1 || req.url.search("/getfile") != -1) {
      await imageRouter(req, res);
    } else if (req.url.search("/tags") != -1) {
      await tagsRouter(req, res);
    } else if (req.url.search("/filters") != -1) {
      await filtersRouter(req, res);
    } else if (req.url.search("/user") != -1 || req.url.search("/profile") != -1 || req.url.search("/logout") != -1) {
      await userRouter(req, res);
    }
  })
  .listen(process.env.APP_PORT, logger.info("deploying on " + process.env.APP_PORT));
