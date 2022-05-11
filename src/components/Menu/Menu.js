import React from "react";
import Style from "./Menu.module.scss";
import { NavLink } from "react-router-dom";

/**
 * It returns a nav element with a list of links
 * @returns {JSX.Element} A navbar with 4 links
 */
const Menu = () => {
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

export default Menu;
