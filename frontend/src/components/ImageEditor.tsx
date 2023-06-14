import { Card } from "@mui/material";
import React from "react";

function ImageEditor(props: any) {
  return (
    <Card variant="outlined">
      <img src={props.path} />
    </Card>
  );
}

export default ImageEditor;
