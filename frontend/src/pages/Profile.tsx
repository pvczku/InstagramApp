import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Card, Grid, Input, TextField, Avatar, Button } from "@mui/material";

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
  const auth = async () => {
    await fetch("https://dev.pkulma.pl/api/profile", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }).then((res) =>
      res.json().then((data) => {
        if (data.message) {
          new Cookies().remove("token");
          navigate("/login");
        }
      })
    );
  };
  useEffect(() => {
    auth();

    if (!cookies.get("token")) {
      navigate("/login");
    } else {
      fetchProfile();
      fetchData();
    }
    trigger = false;
  }, [trigger]);

  const fetchData = () => {
    fetch("https://dev.pkulma.pl/api/profile", {
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

  const fetchProfile = async () => {
    const res = await fetch("https://dev.pkulma.pl/api/profile/getPP", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const imageBlob = await res.blob();
    const imageObjectUrl = URL.createObjectURL(imageBlob);
    setProfile(imageObjectUrl);
  };

  const handleButton = async () => {
    const formData = new FormData();
    formData.append("file", img);
    await fetch("https://dev.pkulma.pl/api/profile", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
    fetchProfile();
  };
  const handleNamesButton = async () => {
    if (name && lastName) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("lastName", lastName);
      await fetch("https://dev.pkulma.pl/api/profile", {
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
      <Grid container justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Card variant={"outlined"} style={{ width: "max-content", height: "max-content", padding: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
            {data ? (
              <>
                {data.profilePic ? (
                  <Avatar alt={data.name + " " + data.lastName} src={profile} sx={{ width: 200, height: 200 }} />
                ) : (
                  <Avatar alt={data.name + " " + data.lastName} sx={{ width: 200, height: 200 }} src="/defaultPP.jpg" />
                )}
                <p style={{ fontSize: "42px" }}>
                  {data.name} {data.lastName}
                </p>
                <p>{data.email}</p>
              </>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Input type="file" onChange={(e: any) => setImg(e.target.files[0])} placeholder="E-mail" />
              <Button variant="contained" onClick={handleButton}>
                Change Profile Picture
              </Button>
            </form>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <TextField
                onChange={(e) => setName(e.target.value)}
                label="Name"
                variant="outlined"
                value={name}
                type="email"
              />
              <TextField
                onChange={(e) => setLastName(e.target.value)}
                label="Last Name"
                variant="outlined"
                value={lastName}
                type="email"
              />
              <Button
                variant="contained"
                onClick={() => {
                  handleNamesButton();
                  setName("");
                  setLastName("");
                }}
              >
                Change Name
              </Button>
            </form>
          </div>
        </Card>
      </Grid>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}></div>
    </div>
  );
}

export default Profile;
