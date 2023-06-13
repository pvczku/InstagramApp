import React, { useEffect, useState } from "react";

import { SinglePost } from "./Home";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import Cookies from "universal-cookie";
import { Data } from "./Profile";
import { Avatar } from "@chakra-ui/react";

function User() {
  const token = new Cookies().get("token");
  const { id } = useParams();
  let trigger = true;
  const [posts, setPosts] = useState<SinglePost[]>([]);
  const [data, setData] = useState<Data>();
  const [profile, setProfile] = useState("");
  const fetchData = () => {
    const response = fetch("https://dev.pkulma.pl/api/profile/" + id, {
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
    fetchAll();
  }, []);
  useEffect(() => {
    fetchProfile();
  }, [data]);

  return (
    <>
      {profile ? <Avatar size={"2xl"} src={profile}></Avatar> : <Avatar size={"2xl"} src="/defaultPP.jpg" />}
      {data ? (
        <>
          <div>
            {data.name} {data.lastName}
          </div>
          <div>{data.email}</div>
        </>
      ) : null}
      {posts.length > 0 && data
        ? posts.map((post, index) => (post.addedBy === data.email ? <Post object={post} key={index}></Post> : null))
        : null}
    </>
  );
}

export default User;
