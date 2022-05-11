import React from "react";
import { Link } from "react-router-dom";

/**
 * It returns a div with a 404 error message and a link to the profile page
 * @returns {JSX.Element} The return of the function is a div with a h1 and a link.
 */
const Error404 = () => {
  return (
    <div>
      <h1>404</h1>
      <Link to="/profil/:user">Retour à la page de profil</Link>
    </div>
  );
};

export default Error404;
