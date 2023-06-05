const formidable = require("formidable");
const model = require("./model");
const tagsController = require("./tagsController");

const router = async (req, res) => {
  let url = req.url;
  switch (req.method) {
    case "GET":
      if (req.url === "/tags") {
        res.writeHead(200, { "content-type": "application/json" });
        const tags = tagsController.getTags();
        res.end(JSON.stringify(tags, null, 5));
      } else if (req.url === "/tags/raw") {
        res.writeHead(200, { "content-type": "application/json" });
        const rawTags = tagsController.getRawTags();
        res.end(JSON.stringify(rawTags, null, 5));
      } else {
        const regex = "/tags/[0-9]+";
        if (url.match(regex)) {
          const id = url.split("tags/")[1];
          const tag = tagsController.getTag(Number(id));
          res.writeHead(200, { "content-type": "application/json" });
          if (tag.message === "not found") {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify(tag, null, 5));
          } else {
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(tag, null, 5));
          }
        }
      }
      break;
    case "POST":
      if (req.url === "/tags") {
        const form = formidable();
        form.parse(req, (err, fields) => {
          if (err) {
            res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
            res.end(String(err));
            return;
          }
          const tag = fields.tag;
          const newTag = tagsController.addTag(tag);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newTag, null, 2));
        });
      }
      break;
  }
};

module.exports = router;
