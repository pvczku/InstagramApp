import { useEffect } from "react";
import LoginForm from "../components/LoginForm";
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
    <>
      <div
        style={{
          backgroundImage: "url('/background.jpg')",
          filter: "blur(5px)",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "-100",
        }}
      ></div>
      <LoginForm></LoginForm>
    </>
  );
}

export default Login;
