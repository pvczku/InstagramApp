import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  ButtonGroup,
  Textarea,
} from "@chakra-ui/react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Tag from "../components/Tag";
const cookies = new Cookies();
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

function Upload() {
  const navigate = useNavigate();
  const token = cookies.get("token");
  if (!cookies.get("token")) {
    navigate("/login");
  }
  const [tags, setTags] = useState<any>([]);
  const [tag, setTag] = useState("");
  const [textarea, setTextarea] = useState("");
  const [img, setImg] = useState<any>();
  const [error, setError] = useState<string>("");

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

  const handleTagInputChange = (e: any) => {
    setTag(e.target.value);
  };

  const handleTextarea: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.target) {
      setTextarea(e.target.value);
    }
  };

  const removeTagFromArray = (index: number) => {
    const result = tags.filter((tag: string) => tags.indexOf(tag) !== index);
    setTags(result);
  };

  const handleImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setImg(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    let imgID: string;
    if (img && tags.length > 0 && textarea) {
      setError("");
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
        const tagsResponse = await fetch("https://dev.pkulma.pl/api/photos/tags/mass", {
          method: "PATCH",
          body: tagsFormData,
        }).then((res) => res.json().then((data) => console.log(data)));
      } else {
        const tagsResponse = await fetch("https://dev.pkulma.pl/api/photos/tags", {
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
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Navbar></Navbar>
      <div>
        <FormControl>
          <Input
            onChange={handleImage}
            w={"400px"}
            h={"400px"}
            accept="image/png, image/gif, image/jpeg"
            isRequired={true}
            type="file"
            id="file"
            multiple={false}
            focusBorderColor="purple.400"
            variant="filled"
          />
          <Textarea onChange={handleTextarea} placeholder="Description..."></Textarea>
          <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "500px" }}>
            {tags.length > 0
              ? tags.map((tag: string) => (
                  <Tag name={tag} key={tags.indexOf(tag)} number={tags.indexOf(tag)} removeTag={removeTagFromArray} />
                ))
              : ""}
          </div>
          <Input
            placeholder="Enter tag..."
            value={tag}
            onInput={handleTagInputChange}
            onKeyUp={handleTagInputKeyDown}
          ></Input>
          <Button type="submit" onClick={handlePost}>
            Post
          </Button>
        </FormControl>
        {error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
            <AlertDescription>Please fill every input and try again!</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}

export default Upload;
