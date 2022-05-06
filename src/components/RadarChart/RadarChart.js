import PropTypes from "prop-types";
import Style from "../RadarChart/RadarChart.module.scss";
import { useEffect, useRef, useState } from "react";
import datas from "../../mock/datas.json";
import * as d3 from "d3";
import { RadarChartConstructor } from "../../services";

const RadarChart = ({ dimOfRadarChart, userId }) => {
  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  // Init a state for datas fetched from api
  const [userPerformance, setUserPerformance] = useState({});

  useEffect(
    (e) => {
      // Get datas from the api
      setUserPerformance(
        datas.USER_PERFORMANCE.find((e) => e.userId === userId)
      );
    },
    [userPerformance]
  );

  useEffect(() => {
    if (userPerformance !== {} && dimOfRadarChart.width) {
      // Remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#radarChart > *").remove();

      const margins = { top: 40, bottom: 40, right: 40, left: 40 };
      const svg = d3.select(svgRef.current);

      const radarChart = new RadarChartConstructor(
        dimOfRadarChart,
        margins,
        svg,
        userPerformance
      );

      radarChart.buildGraph();
    }
  });

  return (
    <svg
      id="radarChart"
      className={Style.radarChart}
      ref={svgRef}
      width={dimOfRadarChart.width}
      height={dimOfRadarChart.height}
    ></svg>
  );
};

RadarChart.propTypes = {};

export default RadarChart;
