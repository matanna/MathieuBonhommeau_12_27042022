import React, { useEffect, useRef, useState } from "react";
import Style from "./Profil.module.scss";
import { BarChart, LinearChart } from "../../components";

const Profil = () => {
  // State for width and height of BarChart
  const [dimOfBarChart, setDimOfBarChart] = useState({
    width: null,
    height: null,
  });

  // State for width and height of BarChart
  const [dimOfLinearChart, setDimOfLinearChart] = useState({
    width: null,
    height: null,
  });

  // Ref of div which contains barchart graph, allow retrieve size of it (width and height)
  const barChartRef = useRef(null);
  // Ref of div which contains linearchart graph, allow retrieve size of it (width and height)
  const linearChartRef = useRef(null);

  useEffect(() => {
    setDimOfBarChart({
      width: barChartRef.current.offsetWidth,
      height: barChartRef.current.offsetHeight,
    });
    setDimOfLinearChart({
      width: linearChartRef.current.offsetWidth,
      height: linearChartRef.current.offsetHeight,
    });
    /*window.addEventListener("resize", (e) => {
      setDimOfBarChart({
        width: barChartRef.current.offsetWidth,
        height: barChartRef.current.offsetHeight,
      });
    });*/
  }, []);

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
            <div ref={barChartRef} className={Style.barChart}>
              <BarChart dimOfBarChart={dimOfBarChart} />
            </div>
            <div ref={linearChartRef} className={Style.linearChart}>
              <LinearChart dimOfLinearChart={dimOfLinearChart} />
            </div>
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
