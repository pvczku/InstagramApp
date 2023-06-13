const logger = require("tracer").colorConsole();
const formidable = require("formidable");
const fileController = require("./fileController.js");
const jsonController = require("./jsonController.js");
const model = require("./model.js");
const path = require("path");
const tagsController = require("./tagsController.js");
const fs = require("fs");
const userController = require("./userController.js");

const router = async (req, res) => {
  const url = req.url;
  switch (req.method) {
    case "GET":
      if (req.url.search("/getfile") != -1) {
        if (req.url.split("getfile/")[1].split("/").length === 1) {
          const response = fileController.getImage(jsonController.getImage(req.url.split("getfile/")[1]));
          if (response) {
            fs.readFile(response.url, (err, content) => {
              if (err) {
                res.writeHead(400, { "Content-type": "text/html" });
                console.log(err);
                res.end("No such image");
              } else {
                res.writeHead(200, { "Content-type": "image/jpeg" });
                res.end(content);
              }
            });
          }
        } else {
          const splittedUrl = req.url.split("getfile/")[1].split("/");
          const imgID = splittedUrl[0];
          const filter = splittedUrl[1];
          const response = fileController.getImage(jsonController.getImage(imgID));
          console.log(response);
          if (response) {
            let filtered;
            for (let i = 0; i < response.history.length; i++) {
              console.log(response.history[i]);
              if (response.history[i].status === filter) {
                filtered = response.history[i].url;
              }
            }
            fs.readFile(filtered, (err, content) => {
              if (err) {
                res.writeHead(400, { "Content-type": "text/html" });
                console.log(err);
                res.end("No such image");
              } else {
                res.writeHead(200, { "Content-type": "image/jpeg" });
                res.end(content);
              }
            });
          }
        }
      } else {
        if (req.url === "/photos") {
          let photos = model.photos;
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(photos, null, 5));
        } else if (url.split("photos/")[1] !== "") {
          if (url.split("photos/")[1].split("/")[0] === "tags" && url.split("photos/")[1].split("/")[1] > 0) {
            const response = tagsController.getPhotoTags(Number(url.split("photos/")[1].split("/")[1]));
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ tags: response }, null, 5));
          } else {
            const imgID = url.split("/photos/")[1];
            res.writeHead(200, { "content-type": "application/json" });
            const response = jsonController.getImage(imgID);
            res.end(JSON.stringify(response, null, 5));
          }
        }
      }
      break;
    case "POST":
      if (req.url === "/photos") {
        const id = new Date().getTime();
        const form = formidable({ multiples: false });
        form.parse(req, async (err, fields, file) => {
          if (err) {
            res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
            res.end(String(err));
            return;
          }
          const user = await userController.auth(req.headers.authorization.split("Bearer ")[1]);
          const message = await fileController.saveImage(id, user.email, fields.desc, file);
          const fileJson = await jsonController.getImage(id);
          res.writeHead(200, { "Content-Type": "text/plain" });
          console.log(user, file, "esia");
          res.end(String(id));
        });
      }
      break;
    case "DELETE":
      if (url.split("photos/")[1] !== "") {
        const imgID = url.split("/photos/")[1];
        res.writeHead(200, { "content-type": "application/json" });
        fileController.removeImage(imgID);
        const response = jsonController.removeImage(imgID);
        res.end(JSON.stringify(response, null, 5));
      }
      break;
    case "PATCH":
      if (url.split("photos/")[1] !== "") {
        if (url.split("photos/")[1] === "tags") {
          const form = formidable({ multiples: false });
          form.parse(req, (err, data) => {
            if (err) {
              res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
              res.end(String(err));
              return;
            }
            const imgID = Number(data.id);
            const tag = data.tag;
            const response = tagsController.assignTag(imgID, tag);
            if (response !== null) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(response, null, 2));
            }
          });
        } else if (url.split("photos/")[1].split("/")[1] === "mass") {
          const form = formidable({ multiples: false });
          form.parse(req, (err, data) => {
            if (err) {
              res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
              res.end(String(err));
              return;
            }
            const imgID = Number(data.id);
            const tags = data.tags.split(",");
            const response = tagsController.assignTags(imgID, tags);
            if (response !== null) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(response, null, 2));
            }
          });
        } else {
          const imgID = url.split("/photos/")[1];
          res.writeHead(200, { "content-type": "application/json" });
          const response = jsonController.changeImage(imgID);
          res.end(JSON.stringify(response, null, 5));
        }
      }
      break;
  }
};

module.exports = router;
