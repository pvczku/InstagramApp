import React, { useEffect, useState } from "react";
import { SinglePost } from "../pages/Home";
import Cookies from "universal-cookie";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

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
    const tags = await fetch("https://dev.pkulma.pl/api/photos/tags/" + props.object.id).then((res) => {
      res.json().then((data) => {
        setTags(data.tags);
      });
    });
  };

  const fetchAllUsers = async () => {
    const users = await fetch("https://dev.pkulma.pl/api/user/all").then((res) =>
      res.json().then((data) => {
        console.log(data);
        setUsers(data);
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
    <>
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        {profile ? <Avatar src={profile} /> : <Avatar src={"/defaultPP.jpg"} />}
        
        <Link as={ReactLink} to={"/user/" + props.object.addedBy}>
          @{props.object.addedBy}
        </Link>
      </div>
      <img style={{ maxWidth: "500px " }} src={img} alt="post" />
      <p>{props.object.desc}</p>
      <p>{tags ? tags.map((tag) => <span key={tags.indexOf(tag)}>{tag.tag} </span>) : "no tags :("}</p>
    </>
  );
}

export default Post;
