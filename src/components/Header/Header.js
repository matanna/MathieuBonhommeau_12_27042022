import React from "react";
import PropTypes from "prop-types";
import Menu from "../Menu/Menu";
import Style from "./Header.module.scss";
import { logo } from "../../assets";

const Header = (props) => {
  return (
    <header className={Style.headerContainer}>
      <div className={Style.logoContainer}>
        <img src={logo} alt="Logo de SportSee" />
      </div>
      <Menu />
    </header>
  );
};

Header.propTypes = {};

export default Header;
