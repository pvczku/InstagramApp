const model = require("./model");
const tagsController = {
  addTag: (tag) => {
    if (typeof tag === "string" && tag[0] !== "#") {
      tag = "#" + tag;
    }
    let exists = false;
    for (const rawTag of model.rawTags) {
      if (rawTag === tag) {
        exists = true;
      }
    }
    if (exists) {
      return { message: "tag already exists" };
    } else {
      model.rawTags.push(tag);
      const newTag = {
        id: model.tags.length,
        tag: tag,
        popularity: 0,
      };
      model.tags.push(newTag);
      return newTag;
    }
  },
  getRawTags: () => {
    return model.rawTags;
  },
  getTags: () => {
    return model.tags;
  },
  getTag: (id) => {
    let found = false;
    let tags = model.tags;
    for (const tag of tags) {
      if (tag.id === Number(id)) {
        found = true;
        return tag;
      }
    }
    if (!found) {
      return { message: "not found" };
    }
  },
  assignTag: (imgID, tag) => {
    tag[0] === "#" ? tag : (tag = "#" + tag);
    let existingTag = tagsController.addTag(tag);
    if (existingTag.message) {
      for (const tag1 of model.tags) {
        if (tag1.tag === tag) {
          existingTag = tag1;
        }
      }
    }
    let photoExists = false;
    for (const photo of model.photos) {
      if (photo.id === imgID) {
        photoExists = true;
        if (photo.tags) {
          let photoTagExists = false;
          for (const photoTag of photo.tags) {
            if (photoTag.tag === tag) {
              photoTagExists = true;
              return { message: "this tag is already assigned to this photo" };
            }
          }
          if (!photoTagExists) {
            photo.tags.push(existingTag);
            return photo;
          }
        } else {
          photo.tags = [];
          photo.tags.push(existingTag);
          return photo;
        }
      }
    }
    if (!photoExists) {
      return null;
    }
  },
  assignTags: (imgID, tags) => {
    let photoExists = false;
    for (const photo of model.photos) {
      if (photo.id === imgID) {
        photoExists = true;
        if (tags.length > 1) {
          tags.forEach((singleTag) => {
            tagsController.assignTag(imgID, singleTag);
          });
          return photo;
        }
      }
    }
    if (!photoExists) {
      return { message: "no such a photo" };
    }
  },
  getPhotoTags: (imgID) => {
    for (const photo of model.photos) {
      if (photo.id === imgID) {
        return photo.tags;
      }
    }
    return { message: "not such a photo" };
  },
};

module.exports = tagsController;
