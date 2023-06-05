import React, { useState } from "react";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Data {
  id: number;
  email: string;
  name: string;
  lastName: string;
}

function Profile() {
  let trigger = true;
  const [data, setData] = useState<Data>();
  useEffect(() => {
    if (!cookies.get("token")) {
      navigate("/login");
    } else {
      const response = fetch("https://dev.pkulma.pl/api/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: "GET",
      }).then((res) => {
        res.json().then((data) => {
          console.log(data);
          setData(data);
        });
      });
    }
    trigger = false;
  }, [trigger]);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const token = cookies.get("token");
  //   const [data, setData] = useState({});
  return (
    <div style={{ display: "flex" }}>
      <Navbar></Navbar>
      {data ? (
        <p>
          {data.name} {data.lastName} ({data.email})
        </p>
      ) : null}
    </div>
  );
}

export default Profile;
