import PropTypes from "prop-types";
import * as d3 from "d3";
import datas from "../../mock/datas.json";
import { useEffect, useRef, useState } from "react";
import Style from "./BarChart.module.scss";
import { BarChartConstructor } from "../../services";

const BarChart = ({ dimOfBarChart, userId }) => {
  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  // Init a state for datas fetched from api
  const [userActivity, setUserActivity] = useState({});

  useEffect(() => {
    // Get activity datas thanks to user id
    setUserActivity(datas.USER_ACTIVITY.find((user) => user.userId === userId));
  }, [userActivity]);

  useEffect(() => {
    // Launch build graph only if all datas available
    if (userActivity !== {} && dimOfBarChart.width) {
      d3.selectAll("#barChart > *").remove();
      // Get datas for fill the graph
      const activityDatas = userActivity.sessions.map((session, i) => ({
        kilogram: session.kilogram,
        day: session.day,
        nbDay: i + 1,
        calories: session.calories,
      }));

      // Get svg element for d3
      const svg = d3.select(svgRef.current);

      // Margin in svg for the graph
      const margins = { top: 90, right: 90, left: 43, bottom: 62.5 };

      // Call the constructor of barChart which use d3 for create it
      const barChart = new BarChartConstructor(
        dimOfBarChart,
        margins,
        svg,
        activityDatas
      );

      barChart.buildGraph();
    }
  }, [userActivity, dimOfBarChart]);

  return (
    <svg
      id="barChart"
      className={Style.barChart}
      ref={svgRef}
      width={dimOfBarChart.width}
      height={dimOfBarChart.height}
    ></svg>
  );
};

BarChart.propTypes = {};

export default BarChart;
