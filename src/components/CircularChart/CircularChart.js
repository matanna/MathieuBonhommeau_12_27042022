import PropTypes from "prop-types";
import Style from "../CircularChart/CircularChart.module.scss";
import { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import { CircularChartBuilder, useFetchDatas } from "../../services";
import { UserIdContext } from "../../context/UserIdContext";

const CircularChart = ({ dimOfCircularChart }) => {
  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  const userId = useContext(UserIdContext);

  /**
   * Get datas from api
   */
  const { datas, error } = useFetchDatas(userId, "");

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    if (Object.keys(datas).length !== 0 && dimOfCircularChart.width) {
      // Remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#circularChart > *").remove();

      const margins = { top: 40, bottom: 40, right: 40, left: 40 };
      const svg = d3.select(svgRef.current);

      const circularChart = new CircularChartBuilder(
        dimOfCircularChart,
        margins,
        svg,
        datas,
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
      width="100%"
      height="100%"
      viewBox={`0 0 ${
        dimOfCircularChart.width ? dimOfCircularChart.width : 0
      } ${dimOfCircularChart.height ? dimOfCircularChart.height : 0}`}
    ></svg>
  );
};

CircularChart.propTypes = {
  dimOfCircularChart: PropTypes.exact({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

export default CircularChart;
