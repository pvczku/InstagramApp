import { useEffect, useState } from "react";
import { SinglePost } from "../pages/Home";
import Cookies from "universal-cookie";
import { Avatar, Card } from "@mui/material";
import { Link } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import PostTag from "./PostTag";
export interface Tag {
  id: number;
  tag: string;
  popularity: number;
}

export interface UserInterface {
  confirmed: boolean;
  email: string;
  id: number;
  lastName: string;
  name: string;
}

function Post(props: { object: SinglePost; key: number }) {
  const token = new Cookies().get("token");
  const [img, setImg] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [profile, setProfile] = useState("");
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [user, setUser] = useState<number>();
  const fetchProfile = async () => {
    const res = await fetch("https://dev.pkulma.pl/api/profile/getPP/" + props.object.addedBy, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const imageBlob = await res.blob();
    const imageObjectUrl = URL.createObjectURL(imageBlob);
    setProfile(imageObjectUrl);
  };
  const fetchImage = async () => {
    const res = await fetch("https://dev.pkulma.pl/api/getfile/" + props.object.id);
    const imageBlob = await res.blob();
    const imageObjectUrl = URL.createObjectURL(imageBlob);
    setImg(imageObjectUrl);
  };

  const fetchTags = async () => {
    await fetch("https://dev.pkulma.pl/api/photos/tags/" + props.object.id).then((res) => {
      res.json().then((data) => {
        setTags(data.tags);
      });
    });
  };

  const fetchAllUsers = async () => {
    await fetch("https://dev.pkulma.pl/api/user/all").then((res) =>
      res.json().then((data) => {
        console.log(data);
        setUsers(data);
        for (let i = 0; i < data.length; i++) {
          if (data[i].email === props.object.addedBy) {
            setUser(data[i].id);
          }
        }
      })
    );
  };

  useEffect(() => {
    fetchAllUsers();
    fetchImage();
    fetchTags();
    fetchProfile();
  }, []);

  return (
    <Card variant="outlined" style={{ padding: "2rem", borderRadius: "10px", width: "max-content" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          margin: "0 0 2rem 0",
          gap: "1.5rem",
        }}
      >
        {profile ? (
          <Avatar style={{ width: "50px", height: "50px" }} src={profile} />
        ) : (
          <Avatar src={"/defaultPP.jpg"} />
        )}

        {user ? (
          <Link as={ReactLink} to={"/user/" + user}>
            <b>@{props.object.addedBy}</b>
          </Link>
        ) : (
          <p>
            <b>@{props.object.addedBy}</b>
          </p>
        )}
      </div>
      <div
        style={{
          width: "500px",
          height: "500px",
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img style={{ width: "500px" }} src={img} alt="post" />
      </div>
      <p style={{ margin: "20px 0" }}>
        <b>{props.object.addedBy}: </b>
        {props.object.desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: " " }}>
        {tags ? tags.map((tag, index) => <PostTag key={index} name={tag.tag}></PostTag>) : "no tags :("}
      </div>
    </Card>
  );
}

export default Post;
