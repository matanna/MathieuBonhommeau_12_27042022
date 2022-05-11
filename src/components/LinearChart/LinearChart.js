import PropTypes from "prop-types";
import { useRef, useEffect, useContext } from "react";
import Style from "./LinearChart.module.scss";
import * as d3 from "d3";
import { LinearChartBuilder, useFetchDatas } from "../../services";
import { UserIdContext } from "../../context/UserIdContext";

const LinearChart = ({ dimOfLinearChart }) => {
  const userId = useContext(UserIdContext);

  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  /**
   * Get datas from api
   */
  const { datas, error } = useFetchDatas(userId, "average-sessions");

  /**
   * Create the graph when the component is mount and rerender
   */
  useEffect(() => {
    if (Object.keys(datas).length !== 0 && dimOfLinearChart.width) {
      // Remove all elements in svg for displayed the new ones with the new datas
      d3.selectAll("#linearChart > *").remove();

      const margins = { top: 80, bottom: 77, right: 13, left: 13 };
      const svg = d3.select(svgRef.current);

      const linearChart = new LinearChartBuilder(
        dimOfLinearChart,
        margins,
        svg,
        datas,
        Style
      );

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
