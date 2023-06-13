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
        setData(data);
      });
    });
  };

  //! FIX THAT SHIT

  const fetchProfile = async () => {
    if (data) {
      const res = await fetch("https://dev.pkulma.pl/api/profile/getPP/" + data.id, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });
      const imageBlob = await res.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setProfile(imageObjectUrl);
    }
  };
  const fetchEverything = async () => {
    const userData = await fetchData();
    const images = await fetch("https://dev.pkulma.pl/api/photos").then((res) => {
      res.json().then((data) => {
        let particularPosts = [];
        for (let i = 0; i < data.length; i++) {
          particularPosts.push(data[i]);
        }
        setPosts(particularPosts);
      });
    });
    const pp = await fetchProfile();
  };

  useEffect(() => {
    fetchEverything();

    trigger = false;
  }, [trigger]);

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
      {posts.length > 0
        ? posts.map((post, index) => (post.addedBy === id ? <Post object={post} key={index}></Post> : null))
        : null}
    </>
  );
}

export default User;