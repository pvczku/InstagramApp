const model = require("./model");

const jsonController = {
  addImage: (id, album, desc, url) => {
    let photos = model.photos;
    let something = {
      id: id,
      album: album,
      addedBy: album,
      url: url,
      lastChange: "original",
      desc: desc,
      history: [
        {
          status: "original",
          lastModifiedDate: new Date().getTime(),
        },
      ],
    };
    model.photos = [something, ...photos];
    console.log(model.photos)
    return something;
  },
  getImage: (id) => {
    let photos = model.photos;
    let found = false;
    let foundPhoto;
    photos.forEach((photo) => {
      if (found === false) {
        if (photo.id == Number(id)) {
          found = true;
          foundPhoto = photo;
        }
      }
    });
    if (!found) {
      return { message: "No image with the provided id" };
    } else {
      return [foundPhoto];
    }
  },
  changeImage: (imgID, text, url) => {
    let photos = model.photos;
    const timestamp = new Date().toUTCString();
    let changed = false;
    photos.forEach((photo) => {
      if (photo.id == Number(imgID)) {
        let howMuchChanges = photo.history.length;
        let status = text || `change ${howMuchChanges}`;
        let newChange;
        if (status === text) {
          newChange = {
            status: status,
            timestamp: timestamp,
            url: url,
          };
        } else {
          newChange = {
            status: status,
            timestamp: timestamp,
          };
        }
        photo.lastChange = status;
        photo.history.push(newChange);
        changed = true;
      }
    });
    model.photos = photos;
    if (changed === true) {
      const image = jsonController.getImage(imgID);
      return image;
    } else return { message: "no image for provided id" };
  },

  removeImage: (imgID) => {
    let photos = model.photos;
    let removed = false;
    photos.forEach((photo) => {
      if (photo.id == Number(imgID)) {
        photos.splice(photos.indexOf(photo), 1);
        removed = true;
      }
    });
    model.photos = photos;
    if (removed === true) {
      return { message: "photo removed" };
    } else return { message: "photo not found" };
  },
};

module.exports = jsonController;
