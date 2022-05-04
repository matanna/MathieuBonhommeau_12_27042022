import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import Style from "./LinearChart.module.scss";
import * as d3 from "d3";
import datas from "../../mock/datas.json";

const LinearChart = ({ dimOfLinearChart }) => {
  // Get user id from the url
  const params = useParams();

  // Init a state for datas fetched from api
  const [userSessions, setUserSessions] = useState({});

  // Init reference of the svg which displayed the graph
  const svgRef = useRef(null);

  useEffect(
    (e) => {
      // Get datas from the api
      setUserSessions(
        datas.USER_AVERAGE_SESSIONS.find(
          (e) => e.userId === parseInt(params["user"])
        )
      );
    },
    [userSessions]
  );

  useEffect(() => {
    if (userSessions !== {} && dimOfLinearChart.width) {
      const margins = { top: 80, bottom: 77, right: 13, left: 13 };
      const graphWidth = dimOfLinearChart.width - margins.left - margins.right;
      const graphHeight =
        dimOfLinearChart.height - margins.bottom - margins.top;

      // Get element svg for insert the graph
      const svg = d3.select(svgRef.current);

      const title = svg.append("g").append("text");
      title
        .attr("fill", "#FFFFFF")
        .attr("opacity", 0.6)
        .attr("width", 50)
        .attr("font-weight", 500)
        .attr("transform", `translate(34,50)`);
      title.append("tspan").text("Durée moyenne des").attr("x", 0);
      title.append("tspan").text("sessions").attr("x", 0).attr("y", 30);

      // Create the group for the graph
      const graph = svg
        .append("g")
        .attr("transform", `translate(${margins.right}, ${margins.top})`);

      // Get min and max values for x axis and y axis
      const minMaxX = d3.extent(userSessions.sessions.map((e) => e.day));
      const minMaxY = d3.extent(
        userSessions.sessions.map((e) => e.sessionLength)
      );

      // Scale for color
      const opacity = d3
        .scaleLinear()
        .domain([0, userSessions.sessions.map((e) => e.day).length - 1])
        .range([0.6, 0]);

      // Sacle for axes
      const x = d3
        .scaleLinear()
        .domain([parseInt(minMaxX[0]), parseInt(minMaxX[1])])
        .range([0, graphWidth]);
      const y = d3
        .scaleLinear()
        .domain([parseInt(minMaxY[0]), parseInt(minMaxY[1]) + 10])
        .range([graphHeight, 0]);

      const axisXGroup = graph
        .append("g")
        .attr("transform", `translate(0, ${graphHeight})`);
      const axisYGroup = graph.append("g");

      const axisX = d3
        .axisBottom(x)
        .ticks(userSessions.sessions.length)
        .tickPadding(40)
        .tickSize(0)
        .tickFormat(d3.format("d"));
      const axisY = d3.axisLeft(y).ticks(0);

      axisXGroup
        .call(axisX)
        .style("font-size", 14)
        .style("color", "#FFFFFF")
        .style("font-weight", "500")
        .style("opacity", "0.6")
        .select("path")
        .attr("stroke-width", 0);
      axisYGroup.call(axisY).select("path").attr("stroke-width", 0);

      // Fonction for generate coordinates
      const valueLine = d3
        .line()
        .x((d) => x(d.day))
        .y((d) => y(d.sessionLength))
        .curve(d3.curveMonotoneX);

      const gradient = graph.append("linearGradient").attr("id", "gradient");
      gradient
        .append("stop")
        .attr("offset", "5%")
        .attr("stop-color", "#FFFFFF50");
      gradient
        .append("stop")
        .attr("offset", "95%")
        .attr("stop-color", "#FFFFFF");

      // Create paths with valueLine which give us coordinate of each points
      graph
        .append("path")
        .style("fill", "none")
        .style("stroke", "url(#gradient)")
        .attr("stroke-width", 2)
        .attr("d", valueLine(userSessions.sessions));

      graph
        .selectAll("circle")
        .data(userSessions.sessions)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("fill", "#FFFFFF")
        .attr("stroke", "#FFFFFF50");
    }
  }, [dimOfLinearChart, userSessions]);

  return (
    <svg
      className={Style.linearChart}
      ref={svgRef}
      width={dimOfLinearChart.width}
      height={dimOfLinearChart.height}
    ></svg>
  );
};

LinearChart.propTypes = {};

export default LinearChart;
