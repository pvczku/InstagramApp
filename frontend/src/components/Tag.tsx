import React from "react";
import { Button } from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";

function Tag(props: any) {
  const handleTagDelete = () => {
    console.log(props.number);
    props.removeTag(props.number);
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button onClick={handleTagDelete} size={"xxxs"}>
        <CloseIcon></CloseIcon>
      </Button>
      <div className="tag">{props.name}</div>
    </div>
  );
}

export default Tag;
