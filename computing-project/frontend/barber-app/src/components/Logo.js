import React from "react";
import { Link } from "react-router-dom";

const Logo = ({size}) => {
  return (
    <Link to="/">
      <img src="images/logo.png" alt="Barber Logo" className={`${size} mx-auto`} />
    </Link>
  );
};

export default Logo;
