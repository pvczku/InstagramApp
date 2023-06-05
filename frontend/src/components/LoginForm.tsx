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
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleEmail = (e: any) => {
    if (e.target) {
      console.log(e.target.value);
      setEmail(e.target.value);
    }
  };
  const handlePassword = (e: any) => {
    if (e.target) {
      console.log(e.target.value);
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    console.log(formData);
    const response = await fetch("https://dev.pkulma.pl/api/user/login", {
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
  };

  const handleShow = () => setShow(!show);
  return (
    <div>
      <h1>Login</h1>
      <FormControl>
        <Input
          id={"loginEmail"}
          onChange={handleEmail}
          focusBorderColor="purple.400"
          variant="filled"
          type="email"
          placeholder="E-mail"
          value={email}
        />
        <InputGroup size="md">
          <Input
            id={"loginPassword"}
            focusBorderColor="purple.400"
            variant="filled"
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={handlePassword}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button
              className="input-show-button"
              backgroundColor="purple.400"
              color={"white"}
              h="1.75rem"
              size="sm"
              onClick={handleShow}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <ButtonGroup display={"flex"} justifyContent={"flex-start"} spacing="5">
          <Button onClick={handleSubmit} variant={"solid"} colorScheme="purple" w={"100px"}>
            Submit
          </Button>
          <Button
            onClick={async () => {
              setEmail("");
              setPassword("");
              console.log(email, password);
            }}
            variant={"outline"}
            colorScheme="purple"
            w={"100px"}
          >
            Reset
          </Button>
        </ButtonGroup>
        {error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Wrong login data</AlertTitle>
            <AlertDescription>User does not exist or you passed in the wrong data</AlertDescription>
          </Alert>
        ) : null}
      </FormControl>
    </div>
  );
}

export default LoginForm;
