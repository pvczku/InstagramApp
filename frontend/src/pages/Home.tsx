import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Post from "../components/Post";

export interface SinglePost {
  album: string;
  history: Object[];
  addedBy: string;
  id: number;
  lastChange: string;
  desc: string;
  url: string;
}

function Home() {
  let trigger = true;
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [posts, setPosts] = useState<SinglePost[]>([]);

  const fetchEverything = async () => {
    const images = await fetch("https://dev.pkulma.pl/api/photos").then((res) => {
      res.json().then((data) => {
        setPosts(data);
      });
    });
  };

  useEffect(() => {
    if (!cookies.get("token")) {
      navigate("/login");
    } else {
      fetchEverything();
    }
    trigger = false;
  }, [trigger]);

  return (
    <div style={{ display: "flex" }}>
      <Navbar></Navbar>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {posts ? posts.map((post) => <Post object={post} key={posts.indexOf(post)}></Post>) : null}
      </div>
    </div>
  );
}

export default Home;
