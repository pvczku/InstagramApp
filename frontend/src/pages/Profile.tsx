import React, { useState } from "react";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  ButtonGroup,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";

export interface Data {
  id: number;
  email: string;
  name: string;
  lastName: string;
  profilePic?: string;
}

function Profile() {
  let trigger = true;
  const [data, setData] = useState<Data>();
  const [profile, setProfile] = useState("");
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  useEffect(() => {
    if (!cookies.get("token")) {
      navigate("/login");
    } else {
      fetchProfile();
      fetchData();
    }
    trigger = false;
  }, [trigger]);

  const fetchData = () => {
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
  };

  const cookies = new Cookies();
  const navigate = useNavigate();
  const token = cookies.get("token");

  const handleLogout = () => {
    cookies.remove("token");
    navigate("/");
  };

  const fetchProfile = async () => {
    const res = await fetch("https://dev.pkulma.pl/api/profile/getPP", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const imageBlob = await res.blob();
    const imageObjectUrl = URL.createObjectURL(imageBlob);
    setProfile(imageObjectUrl);
  };

  const handleImg = (e: any) => {
    console.log(e.target.files[0]);
    setImg(e.target.files[0]);
  };

  const handleButton = async () => {
    const formData = new FormData();
    formData.append("file", img);
    const response = await fetch("https://dev.pkulma.pl/api/profile", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
    fetchProfile();
  };
  const handleName = (e: any) => {
    setName(e.target.value);
  };
  const handleLastName = (e: any) => {
    setLastName(e.target.value);
  };
  const handleNamesButton = async () => {
    if (name && lastName) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("lastName", lastName);
      const response = await fetch("https://dev.pkulma.pl/api/profile", {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
    }
    fetchData();
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Navbar></Navbar>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          {data ? (
            <>
              {data.profilePic ? (
                <Avatar name={data.name + " " + data.lastName} src={profile} />
              ) : (
                <Avatar name={data.name + " " + data.lastName} src="/defaultPP.jpg" />
              )}
              <p>
                {data.name} {data.lastName} ({data.email})
              </p>
            </>
          ) : null}
          <Button onClick={handleLogout}>Log Out</Button>
          <hr />
        </div>
        <div style={{ height: "500px", width: "500px" }}>
          <h2>Profile Picture Change</h2>
          <FormControl>
            <Input
              onChange={handleImg}
              type="file"
              focusBorderColor="purple.400"
              variant="filled"
              placeholder="E-mail"
            />
            <Button onClick={handleButton}>Change Profile Picture</Button>
          </FormControl>
        </div>
        <div style={{ height: "500px", width: "500px" }}>
          <h2>Name and Last Name Change</h2>
          <FormControl>
            <Input
              onChange={handleName}
              type="text"
              focusBorderColor="purple.400"
              variant="filled"
              placeholder="Name"
            />
            <Input
              onChange={handleLastName}
              type="text"
              focusBorderColor="purple.400"
              variant="filled"
              placeholder="Last Name"
            />
            <Button onClick={handleNamesButton}>Change Name</Button>
          </FormControl>
        </div>
      </div>
    </div>
  );
}

export default Profile;
