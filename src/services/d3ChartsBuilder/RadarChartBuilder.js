import * as d3 from "d3";

class RadarChartBuilder {
  COLOR_AREA = "#FF0101";
  COLOR = "#FFFFFF";

  constructor(dimOfRadarChart, margins, svg, userPerformance, Style) {
    // Dimensions of svg container
    this.dimOfRadarChart = dimOfRadarChart;
    // Margins in svg for the graph
    this.margins = margins;
    // svg container
    this.svg = svg;
    // Datas fetch from api
    this.userPerformance = userPerformance;
    // Style from react component module scss
    this.Style = Style;

    // Real dimensions of the graph
    this.graphWidth =
      this.dimOfRadarChart.width - this.margins.left - this.margins.right;
    this.graphHeight =
      this.dimOfRadarChart.height - this.margins.bottom - this.margins.top;
    this.graphDiameter =
      this.dimOfRadarChart.width - this.margins.left - this.margins.right;

    // Init graph group
    this.graph = "";

    // Init scale
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
    this.graph = this.svg
      .append("g")
      .attr("transform", `translate(${translateX}, ${translateY})`);

    // Get max value of data for calculate scale
    this.max = d3.max(this.userPerformance.data.map((e) => e.value));

    // Scales for calculate coordinates
    // rad is for calculate the angle in radian
    this.rad = d3
      .scaleLinear()
      .domain([0, Object.keys(this.userPerformance.kind).length])
      .range([0, Math.PI * 2]);
    // r is for calculate the size of the radius
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

    // Generate coordinate of each label
    const points = Object.keys(this.userPerformance.kind).map((e) => [
      this.graphWidth / 2 +
        this.r(parseInt(this.max + 120)) *
          Math.cos(this.rad(parseInt(e) - 0.5)),
      this.graphHeight / 2 +
        this.r(parseInt(this.max + 70)) * Math.sin(this.rad(parseInt(e) - 0.5)),
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
    // Calculate space between each axes of the radar
    const space = parseInt(this.max + 20) / 4;
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
