import * as d3 from "d3";
import mouseOverEvent from "./mouseOverEvent";

class LinearChartConstructor {
  COLOR = "#FFFFFF";

  constructor(dimOfLinearChart, margins, svg, userSessions) {
    // Dimensions of svg container
    this.dimOfLinearChart = dimOfLinearChart;
    // Margins in svg for the graph
    this.margins = margins;
    // svg container
    this.svg = svg;
    // Datas fetch from api
    this.userSessions = userSessions;

    // Real dimensions of the graph
    this.graphWidth =
      this.dimOfLinearChart.width - this.margins.left - this.margins.right;
    this.graphHeight =
      this.dimOfLinearChart.height - this.margins.bottom - this.margins.top;

    // Init graph group
    this.graph = "";
    // Init scales
    this.x = "";
    this.y = "";
  }

  /**
   * Build the graph
   */
  buildGraph = () => {
    this.initGraph();
    this.getLabels();
    this.getAxes();
    this.getGraph();
  };

  /**
   *  Initialize the graph
   */
  initGraph = () => {
    this.graph = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.margins.right}, ${this.margins.top})`
      );

    // Get min and max values for x axis and y axis
    const minMaxX = d3.extent(this.userSessions.sessions.map((e) => e.day));
    const minMaxY = d3.extent(
      this.userSessions.sessions.map((e) => e.sessionLength)
    );

    // Scale for color
    d3.scaleLinear()
      .domain([0, this.userSessions.sessions.map((e) => e.day).length - 1])
      .range([0.6, 0]);

    // Sacle for axes
    this.x = d3
      .scaleLinear()
      .domain([parseInt(minMaxX[0]), parseInt(minMaxX[1])])
      .range([0, this.graphWidth]);
    this.y = d3
      .scaleLinear()
      .domain([parseInt(minMaxY[0]), parseInt(minMaxY[1]) + 10])
      .range([this.graphHeight, 0]);
  };

  /**
   * Construct and get labels and title for the LinearChart
   */
  getLabels = () => {
    const title = this.svg.append("g").append("text");
    title
      .attr("fill", this.COLOR)
      .attr("opacity", 0.6)
      .attr("width", 50)
      .attr("font-weight", 500)
      .attr("transform", `translate(34,50)`);
    title.append("tspan").text("Durée moyenne des").attr("x", 0);
    title.append("tspan").text("sessions").attr("x", 0).attr("y", 30);
  };

  /**
   * Buid axes of the graph
   */
  getAxes() {
    const axisXGroup = this.graph
      .append("g")
      .attr("transform", `translate(0, ${this.graphHeight})`);
    const axisYGroup = this.graph.append("g");

    const axisX = d3
      .axisBottom(this.x)
      .ticks(this.userSessions.sessions.length)
      .tickPadding(40)
      .tickSize(0)
      .tickFormat(d3.format("d"));
    const axisY = d3.axisLeft(this.y).ticks(0);

    axisXGroup
      .call(axisX)
      .style("font-size", 14)
      .style("color", this.COLOR)
      .style("font-weight", "500")
      .style("opacity", "0.6")
      .select("path")
      .attr("stroke-width", 0);

    axisYGroup.call(axisY).select("path").attr("stroke-width", 0);
  }

  /**
   * Construct the linearchart elements
   */
  getGraph = () => {
    // Fonction for generate coordinates
    const valueLine = d3
      .line()
      .x((d) => this.x(d.day))
      .y((d) => this.y(d.sessionLength))
      .curve(d3.curveMonotoneX);

    const gradient = this.graph.append("linearGradient").attr("id", "gradient");
    gradient
      .append("stop")
      .attr("offset", "5%")
      .attr("stop-color", this.COLOR + "50");
    gradient
      .append("stop")
      .attr("offset", "95%")
      .attr("stop-color", this.COLOR);

    // Create paths with valueLine which give us coordinate of each points
    this.graph
      .append("path")
      .attr("class", "curve")
      .style("fill", "none")
      .style("stroke", "url(#gradient)")
      .attr("stroke-width", 2)
      .attr("d", valueLine(this.userSessions.sessions));

    // Animation of line
    const path = this.graph.select(".curve");
    const length = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(2000)
      .ease(d3.easeCircleOut)
      .attr("stroke-dashoffset", 0);

    // Elements displayed on mouseover event
    this.getOverElements();
  };

  /**
   * Construct and implement element which are displayed on mouseover event
   */
  getOverElements = () => {
    //Element displayed on mouseover
    const overElements = this.graph.append("g");

    // Create the group for over elements
    const overElement = overElements
      .selectAll(".overLinearChart")
      .data(this.userSessions.sessions)
      .enter()
      .append("g")
      .attr("class", "overLinearChart")
      .attr("opacity", 0);

    // Rect transparent for broaden mouse pointer
    overElement
      .append("rect")
      .attr("x", (d) => this.x(d.day) - 35)
      .attr("y", (d) => this.y(d.sessionLength) - 60)
      .attr("width", 70)
      .attr("height", this.graphHeight)
      .attr("fill", "transparent");

    // Visible elements on mouseover
    overElement
      .append("circle")
      .attr("r", 4)
      .attr("cx", (d) => this.x(d.day))
      .attr("cy", (d) => this.y(d.sessionLength))
      .attr("fill", this.COLOR)
      .attr("stroke", this.COLOR + "40")
      .attr("stroke-width", 8)
      .attr("stroke-alignment", "outside");
    overElement
      .append("rect")
      .attr("x", (d, i) =>
        // If we are at the end of the graph, the element is displayed at the left
        i === this.userSessions.sessions.length - 1
          ? this.x(d.day) - 50
          : this.x(d.day)
      )
      .attr("y", (d) => this.y(d.sessionLength) - 40)
      .attr("width", 39)
      .attr("height", 25)
      .attr("fill", this.COLOR);
    overElement
      .append("text")
      .text((d) => `${d.sessionLength} min`)
      .attr("class", "text-overLinearChart")
      .attr("x", (d, i) =>
        // If we are at the end of the graph, the element is displayed at the left
        i === this.userSessions.sessions.length - 1
          ? this.x(d.day) - 50
          : this.x(d.day)
      )
      .attr("y", (d) => this.y(d.sessionLength) - 26)
      .attr("font-size", 8);

    mouseOverEvent("overLinearChart");
  };
}

export default LinearChartConstructor;
