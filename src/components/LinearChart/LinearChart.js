import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react";
import Style from "./LinearChart.module.scss";
import * as d3 from "d3";
import datas from "../../mock/datas.json";
import { LinearChartBuilder } from "../../services";

const LinearChart = ({ dimOfLinearChart, userId }) => {
  // Init a state for datas fetched from api
  const [userSessions, setUserSessions] = useState({});

  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  /**
   * Get data from api
   */
  useEffect(
    (e) => {
      // Get datas from the api
      setUserSessions(
        datas.USER_AVERAGE_SESSIONS.find((e) => e.userId === userId)
      );
    },
    [userSessions]
  );

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    if (userSessions !== {} && dimOfLinearChart.width) {
      // Remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#linearChart > *").remove();

      const margins = { top: 80, bottom: 77, right: 13, left: 13 };
      const svg = d3.select(svgRef.current);

      const linearChart = new LinearChartBuilder(
        dimOfLinearChart,
        margins,
        svg,
        userSessions,
        Style
      );

      linearChart.buildGraph();
    }
  }, [dimOfLinearChart, userSessions]);

  return (
    <svg
      id="linearChart"
      className={Style.linearChart}
      ref={svgRef}
      width={dimOfLinearChart.width}
      height={dimOfLinearChart.height}
    ></svg>
  );
};

LinearChart.propTypes = {};

export default LinearChart;
