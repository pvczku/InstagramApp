import React from "react";
import { Link as ReactLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

function Navbar() {
  return (
    <>
      <ul>
        <li style={{ display: "flex", alignItems: "center" }}>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Home
          </Link>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <SearchIcon />
          <Link as={ReactLink} to={"/home"}>
            Search
          </Link>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Explore
          </Link>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Messages
          </Link>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
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
    </>
  );
}

export default Navbar;
