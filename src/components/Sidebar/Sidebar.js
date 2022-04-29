import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import Style from "./Sidebar.module.scss";
import { swim, bike, yoga, fitness } from "../../assets";

/**
 * It returns a div with activities navigation and a footer
 * @returns {JSX.Element} A sidebar with a list of activities and a footer
 */
const Sidebar = () => {
  return (
    <div className={Style.sidebar}>
      <div role="navigation" aria-label="Mes activités">
        <ul>
          <li>
            <NavLink to="/profil/:user/yoga">
              <div className="item">
                <img src={yoga} alt="Yoga" />
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profil/:user/nage">
              <div className="item">
                <img src={swim} alt="Nage" />
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profil/:user/cyclisme">
              <div className="item">
                <img src={bike} alt="Cyclisme" />
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profil/:user/fitness">
              <div className="item">
                <img src={fitness} alt="Fitness" />
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
      <footer>
        <p>Copiryght, SportSee 2020</p>
      </footer>
    </div>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
