import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div>
      <h1>404</h1>
      <Link to="/profil">Retour à la page de profil</Link>
    </div>
  );
};

export default Error404;
