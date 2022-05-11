import * as d3 from "d3";

/**
 * Class for build a RadarChart with d3.js
 */
class RadarChartBuilder {
  // Constants for adapt colors if is necessary
  COLOR_AREA = "#FF0101";
  COLOR = "#FFFFFF";

  /**
   * Constructor
   * @param dimOfRadarChart Dimensions of svg container
   * @param margins Margins in svg for the graph
   * @param svg svg container
   * @param userPerformance Datas fetch from api
   */
  constructor(dimOfRadarChart, margins, svg, userPerformance) {
    this.dimOfRadarChart = dimOfRadarChart;
    this.margins = margins;
    this.svg = svg;
    this.userPerformance = userPerformance;

    /**
     * Width of graph
     * @type {number}
     */
    this.graphWidth =
      this.dimOfRadarChart.width - this.margins.left - this.margins.right;
    /**
     * Height of graph
     * @type {number}
     */
    this.graphHeight =
      this.dimOfRadarChart.height - this.margins.bottom - this.margins.top;
    /**
     * Diameter of graph
     * @type {number}
     */
    this.graphDiameter =
      this.dimOfRadarChart.width - this.margins.left - this.margins.right;

    // Init graph group and scales
    this.graph = "";
    this.rad = "";
    this.x = "";
    this.y = "";
    this.max = "";
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
    // Move the center of the grapĥ
    const translateX = (this.dimOfRadarChart.width - this.graphWidth) / 2;
    const translateY = (this.dimOfRadarChart.height - this.graphHeight) / 2;

    /**
     * Svg group contains all the graph
     * @type {SVGElement}
     */
    this.graph = this.svg
      .append("g")
      .attr("transform", `translate(${translateX}, ${translateY})`);

    /**
     * Get max value of data for calculate scale
     * @type {number}
     */
    this.max = d3.max(this.userPerformance.data.map((e) => e.value));

    /**
     * Scale calculate in radian
     * @type {ScaleLinear}
     */
    this.rad = d3
      .scaleLinear()
      .domain([0, Object.keys(this.userPerformance.kind).length])
      .range([0, Math.PI * 2]);

    /**
     * Scale for calculate the size of the radius
     * @type {ScaleLinear}
     */
    this.r = d3
      .scaleLinear()
      .domain([0, parseInt(this.max) + 50])
      .range([0, this.graphDiameter / 3]);
  };

  /**
   * Construct and get labels and title for the LinearChart
   */
  getLabels = () => {
    const labelGroup = this.graph.append("g");

    /**
     * Generate coordinate of each label
     * @type {array} Array of coordinates
     */
    const points = Object.keys(this.userPerformance.kind).map((e) => [
      this.graphWidth / 2 +
        this.r(parseInt(this.max + 120)) *
          Math.cos(this.rad(parseInt(e) - 0.5)),
      this.graphHeight / 2 +
        this.r(parseInt(this.max + 80)) * Math.sin(this.rad(parseInt(e) - 0.5)),
    ]);

    // Position of each label
    points.forEach((e, i) => {
      labelGroup
        .append("text")
        .attr("class", "radar-label")
        .text(this.userPerformance.kind[i + 1])
        .attr("x", e[0])
        .attr("y", e[1])
        .attr("fill", this.COLOR)
        .attr("font-size", 12)
        .attr("font-weight", 500);
    });

    // translate label on graph
    d3.selectAll(".radar-label").each((d, i, e) => {
      const w = e[i].getBBox().width;
      d3.select(e[i]).attr("transform", `translate(-${w / 2}, 0)`);
    });
  };

  /**
   * Buid axes of the graph
   */
  getAxes = () => {
    /**
     * Space between each axes of the radar
     * @type {number}
     */
    const space = parseInt(this.max + 20) / 4;
    /**
     * Coordinates of axes
     * @type {number[]}
     */
    const axes = [space / 2, space, space * 2, space * 3, space * 4];

    const AxisGroup = this.graph.append("g");

    // Generate coordinate of each polygon
    axes.forEach((el) => {
      const points = Object.keys(this.userPerformance.kind).map((e) => [
        this.graphWidth / 2 +
          this.r(el) * Math.cos(this.rad(parseInt(e) - 0.5)),
        this.graphHeight / 2 +
          this.r(el) * Math.sin(this.rad(parseInt(e) - 0.5)),
      ]);

      // Add axes on the graph
      AxisGroup.append("polygon")
        .attr("points", points)
        .attr("fill", "transparent")
        .attr("stroke", this.COLOR);
    });
  };

  /**
   * Construct the linearchart elements
   */
  getGraph = () => {
    // Initial coordinates for the animation
    const pointsInit = this.userPerformance.data.map(() => [
      this.graphWidth / 2,
      this.graphHeight / 2,
    ]);
    // Generate coordinate from each value and create a polygon with
    const points = this.userPerformance.data.map((e) => [
      this.graphWidth / 2 + this.r(e.value) * Math.cos(this.rad(e.kind - 0.5)),
      this.graphHeight / 2 + this.r(e.value) * Math.sin(this.rad(e.kind - 0.5)),
    ]);

    this.graph
      .append("polygon")
      .attr("points", pointsInit)
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      .attr("points", points)
      .attr("fill", this.COLOR_AREA + "BB");
  };
}

export default RadarChartBuilder;
