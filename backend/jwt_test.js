const jwt = require("jsonwebtoken");
let token;
const createToken = async () => {
  token = await jwt.sign(
    {
      email: "asd@asd.com",
      data: "dupa",
    },
    "verysecretkey",
    {
      expiresIn: "30s",
    }
  );
  console.log({ token: token });
};
const verifyToken = async (tokenHashed) => {
  try {
    let decoded = await jwt.verify(tokenHashed, "verysecretkey");
    console.log({ decoded: decoded });
  } catch (err) {
    err ? console.log(err) : null;
  }
};

const processToken = async () => {
  await createToken();
  await verifyToken(token);
};

processToken();
