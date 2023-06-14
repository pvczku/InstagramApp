import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Tag from "../components/Tag";
const cookies = new Cookies();
import { Card, TextField, Button, Snackbar, Alert, Grid } from "@mui/material";

function Upload() {
  const navigate = useNavigate();
  const token = cookies.get("token");
  const auth = async () => {
    console.log("esia");
    await fetch("https://dev.pkulma.pl/api/profile", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }).then((res) =>
      res.json().then((data) => {
        if (data.message) {
          console.log(data.message);
          new Cookies().remove("token");
          navigate("/login");
        } else {
          console.log("token good");
        }
      })
    );
  };

  useEffect(() => {
    auth();
    if (!cookies.get("token")) {
      navigate("/login");
    }
  }, []);

  const [tags, setTags] = useState<any>([]);
  const [tag, setTag] = useState("");
  const [textarea, setTextarea] = useState("");
  const [img, setImg] = useState<any>();
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [editorImage, setEditorImage] = useState("");
  const [imageEditorOpen, setImageEditorOpen] = useState(false);

  const handleTagInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      if (tag.length === 0) {
        return;
      }
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] === tag) {
          setTag("");
          return;
        }
      }
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const removeTagFromArray = (index: number) => {
    const result = tags.filter((tag: string) => tags.indexOf(tag) !== index);
    setTags(result);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePost = async (e: any) => {
    e.preventDefault();
    let imgID: string;
    if (img && tags.length > 0 && textarea) {
      setError("");
      setOpen(false);
      const formData = new FormData();
      const tagsFormData = new FormData();
      formData.append("file", img, "input.png");
      formData.append("desc", textarea);
      await fetch("https://dev.pkulma.pl/api/photos", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      }).then((res) =>
        res.json().then((data) => {
          imgID = data;
          tagsFormData.append("id", imgID);
          if (tags.length > 1) {
            console.log(tags);
            tagsFormData.append("tags", tags);
          } else {
            tagsFormData.append("tag", tags[0]);
          }
        })
      );
      if (tags.length > 1) {
        await fetch("https://dev.pkulma.pl/api/photos/tags/mass", {
          method: "PATCH",
          body: tagsFormData,
        }).then((res) => res.json().then((data) => console.log(data)));
      } else {
        await fetch("https://dev.pkulma.pl/api/photos/tags", {
          method: "PATCH",
          body: tagsFormData,
        }).then((res) =>
          res.json().then((data) => {
            console.log(data);
          })
        );
      }
      navigate("/home");
    } else {
      setError("Not every field is filled");
      setOpen(true);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Navbar></Navbar>
      <Grid container justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Card variant="outlined" style={{ width: "max-content", padding: "2.5rem", borderRadius: "20px" }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "2rem" }} onSubmit={(e) => e.preventDefault()}>
            <TextField onChange={(e: any) => setImg(e.target.files[0])} label="File" variant="outlined" type="file" />
            <TextField
              onChange={(e) => setTextarea(e.target.value)}
              label="Description"
              variant="outlined"
              value={textarea}
              type="text"
              rows={6}
              multiline
            />
            <Card style={{ display: "flex", flexWrap: "wrap", maxWidth: "500px", padding: "10px", gap: ".5rem" }}>
              {tags.length > 0
                ? tags.map((tag: string) => (
                    <Tag name={tag} key={tags.indexOf(tag)} number={tags.indexOf(tag)} removeTag={removeTagFromArray} />
                  ))
                : ""}
            </Card>
            <TextField
              label="Enter tags"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyUp={handleTagInputKeyDown}
            ></TextField>
            <Button style={{ width: "max-content" }} variant="contained" onClick={handlePost}>
              Post
            </Button>
          </form>
          {error ? (
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              open={open}
              onClose={handleClose}
              key={"bottom" + "left"}
              autoHideDuration={3000}
            >
              <Alert severity="error">{error}</Alert>
            </Snackbar>
          ) : null}
        </Card>
      </Grid>
    </div>
  );
}

export default Upload;
