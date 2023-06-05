import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  useEffect(() => {
    if (!cookies.get("token")) {
      navigate("/login");
    }
  });

  return (
    <>
      <p>home</p>
      <Navbar></Navbar>
    </>
  );
}

export default Home;
