import React from "react";
import Menu from "../Menu/Menu";
import Style from "./Header.module.scss";
import { logo } from "../../assets";

const Header = () => {
  return (
    <header className={Style.headerContainer}>
      <div className={Style.logoContainer}>
        <img src={logo} alt="Logo de SportSee" />
      </div>
      <Menu />
    </header>
  );
};

export default Header;
