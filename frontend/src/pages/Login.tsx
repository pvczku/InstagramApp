import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { Link as ReactLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Login() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.get("token")) {
      navigate("/home");
    }
  });
  return (
    <div>
      <LoginForm></LoginForm>
      <p>
        Don't have an account?{" "}
        <Link as={ReactLink} to={"/register"}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default Login;
