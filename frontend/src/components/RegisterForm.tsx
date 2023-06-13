import React, { useState, useRef } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Alert, Card, Divider, Grid, Snackbar, TextField } from "@mui/material";

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
  const [openVerify, setOpenVerify] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseVerify = () => {
    setOpenVerify(false);
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
      const response = await fetch("https://dev.pkulma.pl/api/user/register", {
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
    const response = await fetch(
      `https://dev.pkulma.pl/api/user/confirm/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
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
          open={openVerify}
          onClose={handleCloseVerify}
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
    // <div>
    //   <h1>Register</h1>
    //   <FormControl>
    //     <Input
    //       required
    //       onChange={(e) => setName(e.target.value)}
    //       id="name"
    //       border={"2px solid black"}
    //       focusBorderColor="purple.400"
    //       variant="filled"
    //       placeholder="First Name"
    //       value={name}
    //     />
    //     <Input
    //       onChange={handleLastName}
    //       value={lastName}
    //       id="lastName"
    //       border={"2px solid black"}
    //       focusBorderColor="purple.400"
    //       variant="filled"
    //       placeholder="Last Name"
    //     />
    //     <Input
    //       required
    //       border={"2px solid black"}
    //       id={"registerEmail"}
    //       onChange={handleEmail}
    //       focusBorderColor="purple.400"
    //       variant="filled"
    //       type="email"
    //       placeholder="E-mail"
    //       value={email}
    //     />
    //     <InputGroup size="md">
    //       <Input
    //         required
    //         border={"2px solid black"}
    //         id={"registerPassword"}
    //         focusBorderColor="purple.400"
    //         variant="filled"
    //         pr="4.5rem"
    //         type={show ? "text" : "password"}
    //         placeholder="Password"
    //         onChange={handlePassword}
    //         value={password}
    //       />
    //     </InputGroup>
    //     <InputGroup size="md">
    //       <Input
    //         required
    //         border={"2px solid black"}
    //         id={"registerConfirmPassword"}
    //         focusBorderColor="purple.400"
    //         variant="filled"
    //         pr="4.5rem"
    //         type={show ? "text" : "password"}
    //         placeholder="Confirm Password"
    //         onChange={handleConfirmPassword}
    //         value={confirmPassword}
    //       />
    //       <InputRightElement width="4.5rem">
    //         <Button
    //           className="input-show-button"
    //           backgroundColor="purple.400"
    //           color={"white"}
    //           h="1.75rem"
    //           size="sm"
    //           onClick={handleShow}
    //         >
    //           {show ? "Hide" : "Show"}
    //         </Button>
    //       </InputRightElement>
    //     </InputGroup>
    //     <p className="errorLog">{error}</p>
    //     <ButtonGroup display={"flex"} justifyContent={"flex-start"} spacing="5">
    //       <Button
    //         onClick={handleRegisterSubmit}
    //         variant={"solid"}
    //         colorScheme="purple"
    //         w={"100px"}
    //       >
    //         Submit
    //       </Button>
    //       <Button
    //         onClick={async () => {
    //           setEmail("");
    //           setPassword("");
    //           setConfirmPassword("");
    //           setName("");
    //           setLastName("");
    //         }}
    //         variant={"outline"}
    //         colorScheme="purple"
    //         w={"100px"}
    //       >
    //         Reset
    //       </Button>
    //     </ButtonGroup>
    //     {token ? (
    //       <Button
    //         onClick={handleVerify}
    //         variant={"outline"}
    //         colorScheme="purple"
    //         w={"250px"}
    //       >
    //         Verify Account
    //       </Button>
    //     ) : null}
    //   </FormControl>
    // </div>
  );
}

export default RegisterForm;
