import React, { useEffect, useRef, useState } from "react";
import Style from "./Profil.module.scss";
import {
  BarChart,
  CircularChart,
  LinearChart,
  RadarChart,
} from "../../components";
import { Navigate, useParams } from "react-router-dom";
import UserKeyDatas from "../../components/UserKeyDatas/UserKeyDatas";
import {
  calorieIcon,
  carbohydrateIcon,
  proteinIcon,
  lipidIcon,
} from "../../assets";
import { useFetchDatas } from "../../services";
import { UserIdProvider } from "../../context/UserIdContext";
import { AxiosError } from "axios";

const Profil = () => {
  // Get user id from the url
  const params = useParams();
  const userId = params.user;

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

  // State for width and height of BarChart
  const [dimOfRadarChart, setDimOfRadarChart] = useState({
    width: null,
    height: null,
  });

  // State for width and height of BarChart
  const [dimOfCircularChart, setDimOfCircularChart] = useState({
    width: null,
    height: null,
  });

  // Ref of div which contains barchart graph, allow retrieve size of it (width and height)
  const barChartRef = useRef(null);
  // Ref of div which contains linearchart graph, allow retrieve size of it (width and height)
  const linearChartRef = useRef(null);
  // Ref of div which contains linearchart graph, allow retrieve size of it (width and height)
  const radarChartRef = useRef(null);
  // Ref of div which contains circularchart graph, allow retrieve size of it (width and height)
  const circularChartRef = useRef(null);

  useEffect(() => {
    setDimOfBarChart({
      width: barChartRef.current.offsetWidth,
      height: barChartRef.current.offsetHeight,
    });
    setDimOfLinearChart({
      width: linearChartRef.current.offsetWidth,
      height: linearChartRef.current.offsetHeight,
    });
    setDimOfRadarChart({
      width: radarChartRef.current.offsetWidth,
      height: radarChartRef.current.offsetHeight,
    });
    setDimOfCircularChart({
      width: circularChartRef.current.offsetWidth,
      height: circularChartRef.current.offsetHeight,
    });
  }, []);

  // State for user infos
  const [userInfos, setUserInfos] = useState({});

  /**
   * Get datas from api
   */
  const { datas, error } = useFetchDatas(userId, "");

  useEffect(() => {
    if (Object.keys(datas).length !== 0) {
      setUserInfos(datas.userInfos);
    }
  }, [datas]);

  return error instanceof AxiosError || error instanceof Error ? (
    <Navigate to="/error" replace="true" />
  ) : (
    <UserIdProvider value={userId}>
      <div role="heading" aria-level="1" className={Style.titleContainer}>
        <h1 className={Style.title}>
          Bonjour{" "}
          <span className={Style.userName}>
            {userInfos && userInfos.firstName}
          </span>
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
            <div ref={radarChartRef} className={Style.radarChart}>
              <RadarChart dimOfRadarChart={dimOfRadarChart} />
            </div>
            <div ref={circularChartRef} className={Style.circularChart}>
              <CircularChart dimOfCircularChar={dimOfCircularChart} />
            </div>
          </div>
          <div className={Style.userInfos}>
            <UserKeyDatas dataName="calorie" icon={calorieIcon} />
            <UserKeyDatas dataName="protein" icon={proteinIcon} />
            <UserKeyDatas dataName="carbohydrate" icon={carbohydrateIcon} />
            <UserKeyDatas dataName="lipid" icon={lipidIcon} />
          </div>
        </div>
      </section>
    </UserIdProvider>
  );
};

Profil.propTypes = {};

export default Profil;
