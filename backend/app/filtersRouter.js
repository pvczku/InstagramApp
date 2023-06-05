const filtersController = require("./filtersController");
const formidable = require("formidable");

const filtersRouter = async (req, res) => {
  let url = req.url;
  switch (req.method) {
    case "GET":
      if (url.split("filters/")[1].split("/")[0] === "metadata") {
        const imgID = Number(url.split("metadata/")[1]);
        let metadata;
        await filtersController.getMetadata(imgID).then((info) => {
          metadata = info;
        });
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(metadata, null, 5));
      }
      break;
    case "PATCH":
      const form = formidable({ multiples: false });
      form.parse(req, (err, data) => {
        if (err) {
          res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
          res.end(String(err));
          return;
        }
        const imgID = data.id;
        const change = data.change;
        const value = data.value;
        switch (change) {
          case "rotate":
            const response = filtersController.rotate(imgID, value);
            response.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "resize":
            const response1 = filtersController.resize(imgID, value);
            response1.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "reformat":
            const response2 = filtersController.reformat(imgID, value);
            response2.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "crop":
            const response3 = filtersController.crop(imgID, value);
            response3.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "grayscale":
            const response4 = filtersController.grayscale(imgID);
            response4.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "flip":
            const response5 = filtersController.flip(imgID);
            response5.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "flop":
            const response6 = filtersController.flop(imgID);
            response6.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "negate":
            const response7 = filtersController.negate(imgID);
            response7.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
          case "tint":
            const response8 = filtersController.tint(imgID, value);
            response8.then((resp) => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(resp, null, 5));
            });
            break;
        }
      });
      break;

    default:
      break;
  }
};

module.exports = filtersRouter;
