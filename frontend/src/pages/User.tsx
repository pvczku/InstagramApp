import React, { useEffect, useState } from "react";

import { SinglePost } from "./Home";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import Cookies from "universal-cookie";
import { Data } from "./Profile";
import { Avatar, Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function User() {
  const token = new Cookies().get("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const [posts, setPosts] = useState<SinglePost[]>([]);
  const [data, setData] = useState<Data>();
  const [profile, setProfile] = useState("");
  const fetchData = () => {
    fetch("https://dev.pkulma.pl/api/profile/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        console.log(data);
        setData(data);
      });
    });
    return true;
  };

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
  const fetchProfile = async () => {
    if (data) {
      const res = await fetch("https://dev.pkulma.pl/api/profile/getPP/" + data.email, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });
      const imageBlob = await res.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setProfile(imageObjectUrl);
    }
  };
  const fetchImages = async () =>
    fetch("https://dev.pkulma.pl/api/photos").then((res) => {
      res.json().then((data) => {
        let particularPosts = [];
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          particularPosts.push(data[i]);
        }
        console.log(particularPosts);
        console.log(posts);
        setPosts(particularPosts);
      });
    });

  const fetchAll = async () => {
    fetchData();
    fetchImages();
  };

  useEffect(() => {
    auth();

    fetchAll();
  }, []);
  useEffect(() => {
    fetchProfile();
  }, [data]);

  return (
    <div>
      <Grid container justifyContent={"center"} alignItems={"center"} height={"100vh"} flexDirection={"column"}>
        <Card variant="outlined" style={{ width: "max-content", height: "max-content", padding: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
            {data ? (
              <>
                {profile ? (
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
        </Card>
      </Grid>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          padding: "20px 0 20px 0",
        }}
      >
        {posts.length > 0 && data
          ? posts.map((post, index) => (post.addedBy === data.email ? <Post object={post} key={index}></Post> : null))
          : null}
      </div>
    </div>
  );
}

export default User;
