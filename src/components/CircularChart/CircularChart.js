import PropTypes from "prop-types";
import Style from "../CircularChart/CircularChart.module.scss";
import { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import { CircularChartBuilder, useFetchDatas } from "../../services";
import { UserIdContext } from "../../context/UserIdContext";

/**
 * Component for creating a circular chart using d3
 * @param dimOfCircularChart Object
 * @returns {JSX.Element} A svg element with the id circularChart, the className circularChart, the ref svgRef, the width 100%, the height 100%
 */
const CircularChart = ({ dimOfCircularChart }) => {
  /**
   * Reference of the svg which displayed the graph
   * @type {React.MutableRefObject}
   */
  const svgRef = useRef(null);

  /**
   * UserId which is retrieved by the context
   * @type {string}
   */
  const userId = useContext(UserIdContext);

  // Get datas from api
  const { datas, error } = useFetchDatas(userId, "");

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    if (Object.keys(datas).length !== 0 && dimOfCircularChart.width) {
      // First, remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#circularChart > *").remove();

      /**
       * Get svg element for d3
       * @type {SVGElement>}
       */
      const svg = d3.select(svgRef.current);

      /**
       * Margin in svg container
       * @type {{top: number, left: number, bottom: number, right: number}}
       */
      const margins = { top: 40, bottom: 40, right: 40, left: 40 };

      /**
       * Call the builder of circularChart which use d3 for create it
       * @type {CircularChartBuilder}
       */
      const circularChart = new CircularChartBuilder(
        dimOfCircularChart,
        margins,
        svg,
        datas,
        Style
      );

      // Build the graph
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
