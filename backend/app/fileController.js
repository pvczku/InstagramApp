const logger = require("tracer").colorConsole();
const fs = require("fs");
const jsonController = require("./jsonController.js");

const fileController = {
  saveImage: (id, album, desc, file) => {
    const oldPath = file.file.path;
    let newPath = __dirname;
    newPath = newPath.split("app")[0];
    newPath += "uploads/" + album + "/" + id + ".png";
    if (album !== "") {
      const dirExists = fs.existsSync(__dirname.split("app")[0] + "uploads/" + album);
      if (!dirExists) {
        fs.mkdirSync(__dirname.split("app")[0] + "uploads/" + album);
      }
      fs.rename(oldPath, newPath, async function (err) {
        if (err) {
          console.log(err);
        } else {
          jsonController.addImage(id, album, desc, newPath);
          
        }
      });
    }
  },
  getImage: (imageData) => {
    return imageData[0];
  },
  removeImage: (imgID) => {
    const photo = jsonController.getImage(imgID);
    const path = photo[0].url;
    try {
      fs.unlinkSync(path);
      jsonController.changeImage(imgID);
    } catch (err) {
      if (err) logger.error(err);
    }
  },
};

module.exports = fileController;
