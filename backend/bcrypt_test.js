const bcrypt = require("bcryptjs");
const password = "asd";

const encryptPass = async (pass) => {
  let hashed = await bcrypt.hash(pass, 10);
  console.log({ encrypted: hashed });
};

// encryptPass(password);

const decryptPass = async (password, hashed) => {
  let unhashed = await bcrypt.compare(password, hashed);
  console.log(unhashed);
};
decryptPass(password, "$2a$10$oQ8ezsAsUeVNIwPVkkW/Z.Br/9FRM6hD8xnipaehKCqVAyNeNLbMG");
