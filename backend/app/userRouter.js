const formidable = require("formidable");
const model = require("./model");
const userController = require("./userController");
const jwt = require("jsonwebtoken");
const jsonController = require("./jsonController");
const fs = require("fs");

const userRouter = async (req, res) => {
  switch (req.method) {
    case "POST":
      if (req.url.split("user/")[1] === "register" && req.url.split("/").length === 3) {
        const form = formidable();
        form.parse(req, async (err, data) => {
          if (err) {
            res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
            res.end(String(err));
            return;
          }
          if (data.name !== "" && data.lastName !== "" && data.email !== "" && data.password !== "") {
            const response = await userController.addUser(data);
            if (typeof response !== "string") {
              const token = await userController.createToken(response.email, response.password, "10m");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: `${token}`,
                })
              );
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "this user already exists",
                })
              );
            }
          }
        });
      } else if (req.url.split("user/")[1] === "login") {
        const form = formidable();
        form.parse(req, async (err, data) => {
          if (err) {
            res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
            res.end(String(err));
            return;
          }
          if (data.email !== "" && data.password !== "") {
            const response = await userController.verifyLogin(data.email, data.password);
            if (response === true) {
              console.log("haslo g");
              const token = await userController.createToken(data.email, null, "30m");
              res.setHeader("Authorization", "Bearer " + token);
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end(JSON.stringify({ message: "user authorized" }));
            } else if (response === false) {
              console.log("haslo nie g");
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "incorrect password",
                })
              );
            } else if (response.message === "user not verified") {
              console.log("nie weryfikacja");
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "user not verified",
                })
              );
            } else if (response.message === "no user with that email") {
              console.log("nie uzytkownik");
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "user not found",
                })
              );
            }
          }
        });
      } else if (req.url === "/profile") {
        const token = req.headers.authorization.split("Bearer ")[1];
        const auth = await userController.auth(token);
        console.log(auth, "tutaj!!!!!!!!!!!!!!");
        if (typeof auth === "object") {
          console.log("fetch zdjecia profilowego poszedl");
          const { id } = await userController.getProfileData(null, auth.email);
          const form = formidable({ multiples: false });
          form.parse(req, async (err, fields, file) => {
            if (err) {
              res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
              res.end(String(err));
              return;
            } else {
              const response = await userController.savePP(id, file);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(response, null, 5));
            }
          });
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "token expired",
            })
          );
        }
      }
      break;
    case "GET":
      if (req.url.search("/user") != -1) {
        if (req.url.split("/user")[1] === "/all") {
          const data = userController.getAllUsers();
          console.log(data);
          res.writeHead(200, { "content-type": "application/json" });
          let array = [];
          for (let i = 0; i < data.length; i++) {
            array.push({
              confirmed: data[i].confirmed,
              email: data[i].email,
              id: data[i].id,
              lastName: data[i].lastName,
              name: data[i].name,
            });
          }
          res.end(JSON.stringify(array));
        } else if (req.url.split("/user/")[1].split("/")[0] === "confirm") {
          const token = req.url.split("/user/")[1].split("/")[1];
          const response = await userController.verifyUser(token);
          if (!response.message) {
            let found = false;
            for (let i = 0; i < model.users.length; i++) {
              if (model.users[i].email === response.email) {
                model.users[i].confirmed = true;
                res.writeHead(200, { "Content-Type": "application/json" });
                found = true;
                res.end(JSON.stringify({ message: "user verified" }));
              }
            }
            if (!found) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "user not verified (expired or invalid token)",
                })
              );
            }
          }
        }
      } else if (req.url.search("/profile") != -1) {
        if (req.url.search("/getPP") != -1) {
          if (req.url.search("/getPP/") != -1) {
            const email = req.url.split("getPP/")[1];
            const token = req.headers.authorization.split("Bearer ")[1];
            const auth = await userController.auth(token);
            if (typeof auth === "object") {
              const imageURL = await userController.getPP(email);
              // const imageURL = userData.profilePic;
              if (imageURL !== undefined) {
                await fs.readFile(imageURL, (err, content) => {
                  if (err) {
                    return undefined;
                  } else {
                    res.writeHead(200, { "content-type": "image/jpeg" });
                    res.end(content);
                  }
                });
              } else return;
            }
          } else {
            const token = req.headers.authorization.split("Bearer ")[1];
            const auth = await userController.auth(token);
            if (typeof auth === "object") {
              const imageURL = await userController.getPP(auth.email);
              if (imageURL !== undefined) {
                await fs.readFile(imageURL, (err, content) => {
                  if (err) {
                    return undefined;
                  } else {
                    res.writeHead(200, { "content-type": "image/jpeg" });
                    res.end(content);
                  }
                });
              } else return;
            }
          }
        } else {
          if (req.url.split("/profile")[1] !== "") {
            const token = req.headers.authorization.split("Bearer ")[1];
            const auth = await userController.auth(token);
            if (typeof auth === "object") {
              const userID = req.url.split("/profile/")[1];

              const response = await userController.getProfileData(userID, null);
              if (response.message) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: response.message,
                  })
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(response));
              }
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "token expired",
                })
              );
            }
          } else {
            const token = req.headers.authorization.split("Bearer ")[1];
            console.log(token);
            const auth = await userController.auth(token);
            console.log(auth);
            if (typeof auth === "object") {
              const response = await userController.getProfileData(null, auth.email);
              if (response.message) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: response.message,
                  })
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(response));
              }
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              console.log("super");
              res.end(
                JSON.stringify({
                  message: "token expired",
                })
              );
            }
          }
        }
      } else if (req.url.search("/logout") != -1) {
        console.log("esia");
        const token = req.headers.authorization.split("Bearer ")[1];
        const auth = await userController.auth(token);
        if (typeof auth === "object") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "logged out" }, null, 5));
        }
      }
      break;
    case "PATCH":
      const token = req.headers.authorization.split("Bearer ")[1];
      const auth = await userController.auth(token);
      if (typeof auth === "object") {
        const form = formidable();
        form.parse(req, async (err, data) => {
          if (err) {
            res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
            res.end(String(err));
            return;
          }
          const name = data.name;
          const lastName = data.lastName;
          const response = await userController.changeUser(auth.email, name, lastName);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        });
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "token expired",
          })
        );
      }
      break;
  }
};

module.exports = userRouter;
