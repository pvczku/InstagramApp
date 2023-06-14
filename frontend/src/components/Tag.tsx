import { Button } from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import { Card } from "@mui/material";

function Tag(props: any) {
  const handleTagDelete = () => {
    console.log(props.number);
    props.removeTag(props.number);
  };
  return (
    <Card variant="outlined" style={{ display: "flex", alignItems: "center", padding: "5px 10px" }}>
      <Button onClick={handleTagDelete} size={"xxxs"}>
        <CloseIcon></CloseIcon>
      </Button>
      <div className="tag">{props.name}</div>
    </Card>
  );
}

export default Tag;
