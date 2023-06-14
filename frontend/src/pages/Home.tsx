import { useEffect, useState } from "react";
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
  const token = new Cookies().get("token");

  const [posts, setPosts] = useState<SinglePost[]>([]);

  const fetchEverything = async () => {
    const images = await fetch("https://dev.pkulma.pl/api/photos").then((res) => {
      res.json().then((data) => {
        setPosts(data);
      });
    });
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

  useEffect(() => {
    auth();
    if (!new Cookies().get("token")) {
      navigate("/login");
    } else {
      fetchEverything();
    }
    trigger = false;
  }, [trigger]);

  return (
    <div style={{ display: "flex" }}>
      <Navbar></Navbar>
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
        {posts ? posts.map((post) => <Post object={post} key={posts.indexOf(post)}></Post>) : null}
      </div>
    </div>
  );
}

export default Home;
