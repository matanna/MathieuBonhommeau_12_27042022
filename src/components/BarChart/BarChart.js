import PropTypes from "prop-types";
import * as d3 from "d3";
import { useContext, useEffect, useRef } from "react";
import Style from "./BarChart.module.scss";
import { BarChartBuilder, useFetchDatas } from "../../services";
import { UserIdContext } from "../../context/UserIdContext";

const BarChart = ({ dimOfBarChart }) => {
  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  const userId = useContext(UserIdContext);

  /**
   * Get datas from api
   */
  const { datas, error } = useFetchDatas(userId, "activity");

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    // Launch build graph only if all datas available
    if (Object.keys(datas).length !== 0 && dimOfBarChart.width) {
      // Remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#barChart > *").remove();

      // Get datas for fill the graph
      const activityDatas = datas.sessions.map((session, i) => ({
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
  }, [datas, dimOfBarChart]);

  return (
    <svg
      id="barChart"
      className={Style.barChart}
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${dimOfBarChart.width ? dimOfBarChart.width : 0} ${
        dimOfBarChart.height ? dimOfBarChart.height : 0
      }`}
    ></svg>
  );
};

export default BarChart;
