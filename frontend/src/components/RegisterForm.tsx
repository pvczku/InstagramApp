import { useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";

function RegisterForm() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleValidation = () => {
    let formIsValid = true;
    if (!name) {
      formIsValid = false;
      setError("Name cannot be empty");
      setOpen(true);
    }
    if (!lastName) {
      formIsValid = false;
      setError("Last name cannot be empty");
      setOpen(true);
    }
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
    if (password != confirmPassword) {
      formIsValid = false;
      setError("Passwords do not match!");
      setOpen(true);
    }
    if (!password) {
      formIsValid = false;
      setError("Password cannot be empty");
      setOpen(true);
    }
    if (!confirmPassword) {
      formIsValid = false;
      setError("Confirm password cannot be empty");
      setOpen(true);
    }
    return formIsValid;
  };

  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();
    const validated = handleValidation();
    setError("");
    if (validated) {
      const formData = {
        name: name,
        lastName: lastName,
        email: email,
        password: password,
      };
      console.log(formData);
      await fetch("https://dev.pkulma.pl/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) =>
        console.log(
          res.headers.get("Authorization"), // Bearer <token>
          res.json().then((data) => {
            console.log(data);
            setToken(data.message);
            console.log(token);
          })
        )
      );
    } else {
      setError("Passwords do not match!");
    }
  };
  const handleVerify = async () => {
    await fetch(`https://dev.pkulma.pl/api/user/confirm/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        if (data.message === "user verified") {
          navigate("/login");
        } else {
          setToken("");
          return;
        }
      });
    });
  };
  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
    >
      <Card
        variant="outlined"
        style={{ width: "max-content", padding: "2.5rem" }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "20px",
          }}
        >
          Register
        </h1>
        <form
          onSubmit={handleRegisterSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", columnGap: "1rem" }}>
            <TextField
              onChange={(e) => setName(e.target.value)}
              label="Name"
              variant="outlined"
              value={name}
              type="text"
            />
            <TextField
              onChange={(e) => setLastName(e.target.value)}
              label="Last Name"
              variant="outlined"
              value={lastName}
              type="text"
            />
          </div>
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
          <TextField
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            variant="outlined"
            value={confirmPassword}
            type="password"
          />
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            style={{ width: "max-content", alignSelf: "center" }}
          >
            <Button onClick={handleRegisterSubmit} variant="contained">
              Sign Up
            </Button>
            <Button
              onClick={() => {
                setEmail("");
                setName("");
                setLastName("");
                setPassword("");
                setConfirmPassword("");
              }}
              variant="outlined"
            >
              Reset
            </Button>
          </ButtonGroup>
        </form>
        <Divider style={{ margin: "2rem 0 2rem 0" }} />
        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Button variant="text" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </p>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      {token ? (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={true}
          autoHideDuration={10000}
        >
          <Alert severity="info">
            Please confirm your account by clicking the button{" "}
            <Button onClick={handleVerify} variant={"contained"}>
              Verify
            </Button>
          </Alert>
        </Snackbar>
      ) : null}
    </Grid>
  );
}

export default RegisterForm;
