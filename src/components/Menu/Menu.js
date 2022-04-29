import React from "react";
import PropTypes from "prop-types";
import Style from "./Menu.module.scss";
import { NavLink } from "react-router-dom";

const Menu = (props) => {
  return (
    <nav className={Style.nav}>
      <ul>
        <li>
          <NavLink to="/">Accueil</NavLink>
        </li>
        <li>
          <NavLink to="/profil/:user">Profil</NavLink>
        </li>
        <li>
          <NavLink to="/settings/:user">Réglage</NavLink>
        </li>
        <li>
          <NavLink to="/community/:user">Communauté</NavLink>
        </li>
      </ul>
    </nav>
  );
};

Menu.propTypes = {};

export default Menu;
