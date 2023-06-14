const model = require("./model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const userController = {
  addUser: async (data) => {
    let message;
    if (model.users.length > 0) {
      for (let i = 0; i < model.users.length; i++) {
        if (model.users[i].email === data.email) {
          message = "user with this email already exists";
        }
      }
      if (message === "user with this email already exists") {
        return message;
      }
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const userJson = {
      id: model.users.length + 1,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      profilePic: undefined,
      confirmed: false,
      password: hashed,
    };
    model.users.push(userJson);
    message = userJson;

    console.log({ message: message });
    return message;
  },
  verifyUser: async (token) => {
    try {
      let decoded = jwt.verify(token, "veryimportantkey");
      return decoded;
    } catch (err) {
      return { message: "expired or invalid token" };
    }
  },
  createToken: async (email, pass, time) => {
    let token;
    if (pass === null) {
      console.log(email);
      token = jwt.sign(
        {
          email: email,
        },
        "veryimportantkey",
        {
          expiresIn: time,
        }
      );
    } else {
      token = jwt.sign(
        {
          email: email,
          hashedPass: pass,
        },
        "veryimportantkey",
        {
          expiresIn: time,
        }
      );
    }
    return token;
  },
  verifyLogin: async (email, password) => {
    let foundUser = undefined;
    model.users.forEach((user) => {
      if (user.email === email) {
        foundUser = user;
      }
    });
    if (foundUser !== undefined) {
      if (foundUser.confirmed === true) {
        const decodedPass = await bcrypt.compare(password, foundUser.password);
        return decodedPass;
      } else {
        return { message: "user not verified" };
      }
    } else {
      return { message: "no user with that email" };
    }
  },
  auth: async (token) => {
    return new Promise((res, rej) => {
      try {
        console.log("dziala try");
        const data = jwt.verify(token, "veryimportantkey");
        console.log(data);
        if (data.email) {
          res(data);
        } else {
          rej("token not existing");
        }
      } catch (err) {
        console.log(err);
        res({ message: "token invalid" });
      }
    });
  },
  getProfileData: async (id, email) => {
    if (email === null) {
      let found = false;
      for (const user of model.users) {
        if (user.id == id) {
          found = true;
          console.log(user.name, user.lastName, user.email);
          return user;
        }
      }
      if (!found) {
        return {
          message: "user not found",
        };
      }
    } else {
      let found = false;
      for (const user of model.users) {
        if (user.email == email) {
          found = true;
          console.log(user.name, user.lastName, user.email);
          return user;
        }
      }
      if (!found) {
        return {
          message: "user not found",
        };
      }
    }
  },
  getProfilePic: (email) => {
    let found = false;
    for (const user of model.users) {
      console.log(user.email === email);
      if (user.email == email) {
        console.log("esia");
        found = true;
        console.log(user.name, user.lastName, user.email, user.profilePic);
        return {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
        };
      }
    }
  },

  changeUser: async (email, name, lName) => {
    let found = false;
    for (const user of model.users) {
      if (user.email === email) {
        found = true;
        user.name = name;
        user.lastName = lName;
        return { message: "user changed" };
      }
    }
    if (!found) {
      return { message: "user not found" };
    }
  },
  savePP: (id, file) => {
    const oldPath = file.file.path;
    let newPath = __dirname;
    newPath = newPath.split("app")[0];
    newPath += "uploads/" + id + "/" + id + ".png";
    if (id !== "") {
      const dirExists = fs.existsSync(__dirname.split("app")[0] + "uploads/" + id);
      if (!dirExists) {
        fs.mkdirSync(__dirname.split("app")[0] + "uploads/" + id);
      }
      fs.renameSync(oldPath, newPath);
      let found = false;
      console.log("jupi");
      for (let i = 0; i < model.users.length; i++) {
        if (model.users[i].id === id && model.users.length !== 0) {
          found = true;
          model.users[i].profilePic = newPath;
          console.log(model.users);
          return { message: "profile pic changed" };
        }
      }
      if (found === false) {
        return { message: "no user" };
      }
    }
  },
  getPP: async (email) => {
    let found = false;
    for (let i = 0; i < model.users.length; i++) {
      if (model.users[i].email === email && model.users.length !== 0) {
        found = true;
        if (model.users[i].profilePic === undefined) {
          return undefined;
        } else {
          return model.users[i].profilePic;
        }
      }
    }
  },
  getAllUsers: () => {
    console.log(model.users);
    return model.users;
  },
};

module.exports = userController;
