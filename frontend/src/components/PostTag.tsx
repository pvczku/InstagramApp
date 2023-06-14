import { Card } from "@mui/material";
import React from "react";

function PostTag(props: { name: string }) {
  return (
    <Card
      variant="outlined"
      style={{ display: "flex", alignItems: "center", padding: "5px 10px", width: "max-content" }}
    >
      <div className="tag">{props.name}</div>
    </Card>
  );
}

export default PostTag;
