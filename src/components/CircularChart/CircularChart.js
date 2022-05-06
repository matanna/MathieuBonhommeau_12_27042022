import PropTypes from "prop-types";
import Style from "../CircularChart/CircularChart.module.scss";
import { useEffect, useRef, useState } from "react";
import datas from "../../mock/datas.json";
import * as d3 from "d3";
import { CircularChartBuilder } from "../../services";

const CircularChart = ({ dimOfCircularChar, userId }) => {
  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  // Init a state for datas fetched from api
  const [userData, setUserData] = useState({});

  /**
   * Get data from api
   */
  useEffect(
    (e) => {
      // Get datas from the api
      setUserData(datas.USER_MAIN_DATA.find((e) => e.id === userId));
    },
    [userData]
  );

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    if (userData !== {} && dimOfCircularChar.width) {
      // Remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#circularChart > *").remove();

      const margins = { top: 40, bottom: 40, right: 40, left: 40 };
      const svg = d3.select(svgRef.current);

      const circularChart = new CircularChartBuilder(
        dimOfCircularChar,
        margins,
        svg,
        userData,
        Style
      );

      circularChart.buildGraph();
    }
  });

  return (
    <svg
      id="circularChart"
      className={Style.circularChart}
      ref={svgRef}
      width={dimOfCircularChar.width}
      height={dimOfCircularChar.height}
    ></svg>
  );
};

CircularChart.propTypes = {};

export default CircularChart;
