import React, { useEffect } from "react";
import { Link } from "@chakra-ui/react";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import Cookies from "universal-cookie";

function Register() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.get("token")) {
      navigate("/home");
    }
  });
  return (
    <>
      <RegisterForm></RegisterForm>
    </>
  );
}

export default Register;
