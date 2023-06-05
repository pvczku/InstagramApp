let photos = [];
let rawTags = [
  "#love",
  "#instagood",
  "#fashion",
  "#photooftheday",
  "#art",
  "#photography",
  "#instagram",
  "#beautiful",
  "#picoftheday",
  "#nature",
  "#happy",
  "#cute",
  "#travel",
  "#style",
  "#followme",
  "#tbt",
  "#instadaily",
  "#repost",
  "#like4like",
  "#summer",
  "#beauty",
  "#fitness",
  "#food",
  "#selfie",
  "#me",
  "#instalike",
  "#girl",
  "#friends",
  "#fun",
  "#photo",
];
let tags = [];
let users = [];
rawTags.forEach((tag) => {
  tags[rawTags.indexOf(tag)] = {
    id: rawTags.indexOf(tag),
    tag: tag,
    popularity: Math.floor(Math.random() * 3000),
  };
});

module.exports = { photos: photos, rawTags: rawTags, tags: tags, users: users };
