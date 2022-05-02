import PropTypes from "prop-types";
import * as d3 from "d3";
import datas from "../../mock/datas.json";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import Style from "./BarChart.module.scss";

const BarChart = ({ dimOfBarChart }) => {
  // Get user id from the url
  const params = useParams();
  console.log(dimOfBarChart);
  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  // Get activity datas thanks to user id
  const userActivity = datas.USER_ACTIVITY.find(
    (user) => user.userId === parseInt(params.user)
  );

  useEffect(() => {
    // Get svg element for d3
    const rect = d3.select(svgRef.current).selectAll("rect");

    // Get datas from each users
    const activityDatas = userActivity.sessions.map((session, i) => ({
      kilogram: session.kilogram,
      day: session.day,
      nbDay: i + 1,
      calories: session.calories,
    }));
    // Get min and max of kgs, nbDay and calories for adapt scale of axis
    const minMaxKgs = d3.extent(activityDatas, (d) => d.kilogram);
    const minMaxNbDay = d3.extent(activityDatas, (d) => d.nbDay);
    const minMaxCalories = d3.extent(activityDatas, (d) => d.calories);

    // Setup of axis X and Y and define scales
    const x = d3
      .scaleBand()
      .domain(activityDatas.map((d) => d.nbDay))
      .range([0, dimOfBarChart.width])
      .paddingInner(0.9)
      .paddingOuter(0.2);

    console.log(dimOfBarChart.width);
    const yKgs = d3
      .scaleLinear()
      .domain(minMaxKgs)
      .range(0, dimOfBarChart.height);
    const yCalories = d3
      .scaleLinear()
      .domain(minMaxCalories)
      .range(0, dimOfBarChart.height);

    // add elements and attributes in svg using d3 library
    const initialRect = rect
      .data(activityDatas)
      .attr("width", x.bandwidth())
      .attr("height", 300)
      .attr("x", (d) => x(d.nbDay))
      .attr("y", (d) => d.kilogram)
      .attr("fill", "#282D30");

    initialRect
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .attr("height", 300)
      .attr("x", (d) => x(d.nbDay))
      .attr("y", (d) => d.kilogram);
  }, [dimOfBarChart]);

  return (
    <svg
      className={Style.barChart}
      ref={svgRef}
      width={dimOfBarChart.width}
      height={dimOfBarChart.height}
    >
      <rect></rect>
    </svg>
  );
};

BarChart.propTypes = {};

export default BarChart;
