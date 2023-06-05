import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Handler() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  });
  return <></>;
}

export default Handler;
