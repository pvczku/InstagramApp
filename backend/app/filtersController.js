const sharp = require("sharp");
const model = require("./model");
const jsonController = require("./jsonController");
const fspath = require("path");

const filtersController = {
  getMetadata: (imgID) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      return new Promise(async (res, rej) => {
        try {
          let meta = await sharp(path).metadata();
          res(meta);
        } catch (err) {
          rej(err);
        }
      });
    } else return { message: "no such an image" };
  },
  rotate: (imgID, value) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_rotate.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).rotate(value).toFile(finalPath);
          const response = jsonController.changeImage(imgID, "rotate", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  resize: (imgID, value) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_resize.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).resize({ width: value.width, height: value.height }).toFile(finalPath);
          const response = jsonController.changeImage(imgID, "resize", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  reformat: (imgID, value) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_reformat");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path)
            .toFormat(value)
            .toFile(finalPath + "." + value);
          const response = jsonController.changeImage(imgID, "reformat", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  crop: (imgID, value) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_crop.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).extract(value).toFile(finalPath);
          const response = jsonController.changeImage(imgID, "crop", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  grayscale: (imgID) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_grayscale.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).grayscale().toFile(finalPath);
          const response = jsonController.changeImage(imgID, "grayscale", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  flip: (imgID) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_flip.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).flip().toFile(finalPath);
          const response = jsonController.changeImage(imgID, "flip", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  flop: (imgID) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_flop.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).flop().toFile(finalPath);
          const response = jsonController.changeImage(imgID, "flop", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  negate: (imgID) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_negate.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).negate().toFile(finalPath);
          const response = jsonController.changeImage(imgID, "negate", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
  tint: (imgID, value) => {
    let path = null;
    for (let i = 0; i < model.photos.length; i++) {
      if (model.photos[i].id === imgID) {
        path = model.photos[i].url;
      }
    }
    if (path) {
      let newPath = path.split("/");
      newPath.pop();
      newPath.push(imgID + "_tint.png");
      newPath.shift();
      let finalPath = "";
      for (let i = 0; i < newPath.length; i++) {
        finalPath = finalPath + "/" + newPath[i];
      }
      return new Promise(async (res, rej) => {
        try {
          await sharp(path).tint(value).toFile(finalPath);
          const response = jsonController.changeImage(imgID, "tint", finalPath);
          res(response);
        } catch (err) {
          rej(err);
        }
      });
    }
  },
};

module.exports = filtersController;
