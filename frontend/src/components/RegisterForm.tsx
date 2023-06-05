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

function RegisterForm() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleName = (e: any) => {
    setName(e.target.value);
  };
  const handleLastName = (e: any) => {
    setLastName(e.target.value);
  };

  const handleEmail = (e: any) => {
    if (e.target) {
      setEmail(e.target.value);
    }
  };
  const handlePassword = (e: any) => {
    if (e.target) {
      setPassword(e.target.value);
    }
  };
  const handleConfirmPassword = (e: any) => {
    if (e.target) {
      setConfirmPassword(e.target.value);
    }
  };

  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (password === confirmPassword) {
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
  const handleShow = () => setShow(!show);
  const handleVerify = async () => {
    const response = await fetch(`https://dev.pkulma.pl/api/user/confirm/${token}`, {
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
    <div>
      <h1>Register</h1>
      <FormControl>
        <Input
          required
          onChange={handleName}
          id="name"
          border={"2px solid black"}
          focusBorderColor="purple.400"
          variant="filled"
          placeholder="First Name"
          value={name}
        />
        <Input
          onChange={handleLastName}
          value={lastName}
          id="lastName"
          border={"2px solid black"}
          focusBorderColor="purple.400"
          variant="filled"
          placeholder="Last Name"
        />
        <Input
          required
          border={"2px solid black"}
          id={"registerEmail"}
          onChange={handleEmail}
          focusBorderColor="purple.400"
          variant="filled"
          type="email"
          placeholder="E-mail"
          value={email}
        />
        <InputGroup size="md">
          <Input
            required
            border={"2px solid black"}
            id={"registerPassword"}
            focusBorderColor="purple.400"
            variant="filled"
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={handlePassword}
            value={password}
          />
        </InputGroup>
        <InputGroup size="md">
          <Input
            required
            border={"2px solid black"}
            id={"registerConfirmPassword"}
            focusBorderColor="purple.400"
            variant="filled"
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={handleConfirmPassword}
            value={confirmPassword}
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
        <p className="errorLog">{error}</p>
        <ButtonGroup display={"flex"} justifyContent={"flex-start"} spacing="5">
          <Button onClick={handleRegisterSubmit} variant={"solid"} colorScheme="purple" w={"100px"}>
            Submit
          </Button>
          <Button
            onClick={async () => {
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setName("");
              setLastName("");
            }}
            variant={"outline"}
            colorScheme="purple"
            w={"100px"}
          >
            Reset
          </Button>
        </ButtonGroup>
        {token ? (
          <Button onClick={handleVerify} variant={"outline"} colorScheme="purple" w={"250px"}>
            Verify Account
          </Button>
        ) : null}
      </FormControl>
    </div>
  );
}

export default RegisterForm;
