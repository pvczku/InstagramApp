import React from "react";
import { Link as ReactLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import HomeIcon from "@mui/icons-material/Home";

function Navbar() {
  return (
    <>
      <ul>
        <li>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Home
          </Link>
        </li>
        <li>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Search
          </Link>
        </li>
        <li>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Explore
          </Link>
        </li>
        <li>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Messages
          </Link>
        </li>
        <li>
          <HomeIcon />
          <Link as={ReactLink} to={"/home"}>
            Upload
          </Link>
        </li>
        <li>
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
