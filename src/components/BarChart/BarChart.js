import PropTypes from "prop-types";
import * as d3 from "d3";
import { useContext, useEffect, useRef } from "react";
import Style from "./BarChart.module.scss";
import { BarChartBuilder, useFetchDatas } from "../../services";
import { UserIdContext } from "../../context/UserIdContext";

/**
 * Component for creating a bar chart using d3
 * @param dimOfBarChart Object
 * @returns {JSX.Element} A svg element with the id barChart, the className barChart, the ref svgRef, the width 100%, the height 100%
 */
const BarChart = ({ dimOfBarChart }) => {
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
  const { datas, error } = useFetchDatas(userId, "activity");

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    // Launch build graph only if all datas available
    if (Object.keys(datas).length !== 0 && dimOfBarChart.width) {
      // First, remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#barChart > *").remove();

      /**
       * Adapt datas for fill the graph
       */
      const activityDatas = datas.sessions.map((session, i) => ({
        kilogram: session.kilogram,
        day: session.day,
        nbDay: i + 1,
        calories: session.calories,
      }));

      /**
       * Get svg element for d3
       * @type {SVGElement}
       */
      const svg = d3.select(svgRef.current);

      /**
       * Margins in the svg container
       * @type {{top: number, left: number, bottom: number, right: number}}
       */
      const margins = { top: 90, right: 90, left: 43, bottom: 62.5 };

      /**
       * Call the builder of barChart which use d3 for create it
       * @type {BarChartBuilder}
       */
      const barChart = new BarChartBuilder(
        dimOfBarChart,
        margins,
        svg,
        activityDatas,
        Style
      );
      // Build the graph
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

BarChart.propTypes = {
  dimOfBarChart: PropTypes.exact({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

export default BarChart;
