import PropTypes from "prop-types";
import { useRef, useEffect, useContext } from "react";
import Style from "./LinearChart.module.scss";
import * as d3 from "d3";
import { LinearChartBuilder, useFetchDatas } from "../../services";
import { UserIdContext } from "../../context/UserIdContext";

/**
 * Component for creating a linear chart using d3
 * @param dimOfLinearChart Object
 * @returns {JSX.Element} A svg element with the id linearChart, the className linearChart, the ref svgRef, the width 100%, the height 100%
 */
const LinearChart = ({ dimOfLinearChart }) => {
  /**
   * UserId which is retrieved by the context
   * @type {string}
   */
  const userId = useContext(UserIdContext);

  /**
   * Reference of the svg which displayed the graph
   * @type {React.MutableRefObject}
   */
  const svgRef = useRef(null);

  // Get datas from api
  const { datas, error } = useFetchDatas(userId, "average-sessions");

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    if (Object.keys(datas).length !== 0 && dimOfLinearChart.width) {
      // First, remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#linearChart > *").remove();

      /**
       * Get svg element for d3
       * @type {SVGElement}
       */
      const svg = d3.select(svgRef.current);

      /**
       * Margins in the svg container
       * @type {{top: number, left: number, bottom: number, right: number}}
       */
      const margins = { top: 80, bottom: 77, right: 13, left: 13 };

      /**
       * Call the builder of linearChart which use d3 for create it
       * @type {LinearChartBuilder}
       */
      const linearChart = new LinearChartBuilder(
        dimOfLinearChart,
        margins,
        svg,
        datas,
        Style
      );

      // Build the graph
      linearChart.buildGraph();
    }
  }, [dimOfLinearChart, datas]);

  return (
    <svg
      id="linearChart"
      className={Style.linearChart}
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${dimOfLinearChart.width ? dimOfLinearChart.width : 0} ${
        dimOfLinearChart.height ? dimOfLinearChart.height : 0
      }`}
    ></svg>
  );
};

LinearChart.propTypes = {
  dimOfLinearChart: PropTypes.exact({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

export default LinearChart;
