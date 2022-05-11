import PropTypes from "prop-types";
import Style from "../RadarChart/RadarChart.module.scss";
import { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { RadarChartBuilder, useFetchDatas } from "../../services";
import { UserIdContext } from "../../context/UserIdContext";

/**
 * Component for creating a radar chart using d3
 * @param dimOfRadarChart Object
 * @returns {JSX.Element} A svg element with the id radarChart, the className radarChart, the ref svgRef, the width 100%, the height 100%
 */
const RadarChart = ({ dimOfRadarChart }) => {
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
  const { datas, error } = useFetchDatas(userId, "performance");

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    if (Object.keys(datas).length !== 0 && dimOfRadarChart.width) {
      // First, remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#radarChart > *").remove();

      /**
       * Get svg element for d3
       * @type {SVGElement}
       */
      const svg = d3.select(svgRef.current);

      /**
       * Margin in svg for the graph and adapt them in terms of dimensions of container
       * @type {{top: number, left: number, bottom: number, right: number}}
       */
      let margins = { top: 40, bottom: 40, right: 40, left: 40 };
      if (dimOfRadarChart.width < 360) {
        margins = { top: 20, bottom: 20, right: 20, left: 20 };
      }
      if (dimOfRadarChart.width < 300) {
        margins = { top: 10, bottom: 10, right: 10, left: 10 };
      }

      /**
       * Call the builder of linearChart which use d3 for create it
       * @type {RadarChartBuilder}
       */
      const radarChart = new RadarChartBuilder(
        dimOfRadarChart,
        margins,
        svg,
        datas,
        Style
      );

      // Build the graph
      radarChart.buildGraph();
    }
  }, [datas, dimOfRadarChart]);

  return (
    <svg
      id="radarChart"
      className={Style.radarChart}
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${dimOfRadarChart.width ? dimOfRadarChart.width : 0} ${
        dimOfRadarChart.height ? dimOfRadarChart.height : 0
      }`}
    ></svg>
  );
};

RadarChart.propTypes = {
  dimOfRadarChart: PropTypes.exact({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

export default RadarChart;
