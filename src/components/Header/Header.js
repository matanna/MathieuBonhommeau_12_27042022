import React from "react";
import Menu from "../Menu/Menu";
import Style from "./Header.module.scss";
import { logo } from "../../assets";

/**
 * Component for create the header with a logo and a menu
 * @returns {JSX.Element} A header with a logo and a menu.
 */
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
