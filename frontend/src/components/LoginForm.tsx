import { useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { Alert, Button, ButtonGroup, Card, Divider, Grid, Snackbar, TextField } from "@mui/material";

function LoginForm() {
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleValidation = () => {
    let formIsValid = true;
    if (!email) {
      formIsValid = false;
      setError("Email cannot be empty");
      setOpen(true);
    } else {
      let lastAtPos = email.lastIndexOf("@");
      let lastDotPos = email.lastIndexOf(".");
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          email.indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        setError("Email is not valid");
        setOpen(true);
      }
    }
    if (!password) {
      formIsValid = false;
      setError("Password cannot be empty");
      setOpen(true);
    }
    return formIsValid;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: any) => {
    const validated = handleValidation();
    if (validated) {
      e.preventDefault();
      const formData = {
        email: email,
        password: password,
      };
      await fetch("https://dev.pkulma.pl/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => {
        console.log(
          res.headers.get("Authorization"), // Bearer <token>
          res.json().then((data) => {
            console.log(data); // odpowiedz z serwera
            if (data.message === "user authorized") {
              setError("");
              const token = res.headers.get("Authorization")!.split("Bearer ")[1];
              cookies.set("token", token, { path: "/", maxAge: 1800 });
              navigate("/home");
            } else {
              setError("Wrong login data");
            }
          })
        );
      });
    }
  };

  return (
    <Grid container justifyContent={"center"} alignItems={"center"} height={"100vh"}>
      <Card
        variant="outlined"
        style={{ width: "max-content", padding: "2.5rem", borderRadius: "20px"}}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "20px",
          }}
        >
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "1.25rem",
          }}
        >
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            label="E-mail"
            variant="outlined"
            value={email}
            type="email"
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
            value={password}
            type="password"
          />
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            disableElevation
            style={{ width: "max-content", alignSelf: "center" }}
          >
            <Button onClick={handleSubmit} variant="contained">
              Log In
            </Button>
            <Button
              onClick={() => {
                setEmail("");
                setPassword("");
              }}
              variant="outlined"
            >
              Reset
            </Button>
          </ButtonGroup>
        </form>
        <Divider style={{ margin: "2rem 0 2rem 0" }} />
        <p>
          Don't have an account?{" "}
          <Button variant="text" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </p>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        onClose={handleClose}
        key={"bottom" + "left"}
        autoHideDuration={3000}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Grid>
  );
}

export default LoginForm;
