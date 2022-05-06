import PropTypes from "prop-types";
import * as d3 from "d3";
import datas from "../../mock/datas.json";
import { useEffect, useRef, useState } from "react";
import Style from "./BarChart.module.scss";
import { BarChartBuilder } from "../../services";

const BarChart = ({ dimOfBarChart, userId }) => {
  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  // Init a state for datas fetched from api
  const [userActivity, setUserActivity] = useState({});

  /**
   * Get data from api
   */
  useEffect(() => {
    // Get activity datas thanks to user id
    setUserActivity(datas.USER_ACTIVITY.find((user) => user.userId === userId));
  }, [userActivity]);

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    // Launch build graph only if all datas available
    if (userActivity !== {} && dimOfBarChart.width) {
      // Remove all elements in svg for displayed the new ones with the new datas
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
      const barChart = new BarChartBuilder(
        dimOfBarChart,
        margins,
        svg,
        activityDatas,
        Style
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
