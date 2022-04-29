import React from "react";
import Style from "./Profil.module.scss";

const Profil = () => {
  return (
    <>
      <div role="heading" aria-level="1" className={Style.titleContainer}>
        <h1 className={Style.title}>
          Bonjour <span className={Style.userName}>Toto</span>
        </h1>
        <p>Félicitation ! Vous avez explosé vos objectifs hier 👏</p>
      </div>
      <section>
        <h2 className={Style.hiddenTitle}> Tableau de bord</h2>
        <div className={Style.dashboard}>
          <div className={Style.graphs}>
            <div className={Style.barChart}> BarChart </div>
            <div className={Style.linearChart}> LinearChart </div>
            <div className={Style.radarChart}> RadarChart </div>
            <div className={Style.circularChart}> CircularChart </div>
          </div>
          <div className={Style.userInfos}></div>
        </div>
      </section>
    </>
  );
};

Profil.propTypes = {};

export default Profil;
