import { Link as ReactLink, useNavigate } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";
import Cookies from "universal-cookie";

function Navbar() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.remove("token");
    navigate("/");
  };
  return (
    <div
      style={{
        fontSize: "30px",
        display: "flex",
        flexDirection: "column",
        width: "15rem",
        padding: "10px",
        position: "fixed",
      }}
    >
      <ul>
        <li style={{ display: "flex", alignItems: "center" }}>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Home
          </Link>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <HomeIcon />
          <Link as={ReactLink} to={"/upload"}>
            Upload
          </Link>
        </li>

        <li style={{ display: "flex", alignItems: "center" }}>
          <HomeIcon />
          <Link as={ReactLink} to={"/profile"}>
            Profile
          </Link>
        </li>
      </ul>

      <Button
        variant="contained"
        style={{ height: "max-content", width: "100%", justifySelf: "flex-end" }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );
}

export default Navbar;
