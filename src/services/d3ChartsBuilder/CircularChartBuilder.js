import * as d3 from "d3";

/**
 * Class for build a CircularChart with d3.js
 */
class CircularChartBuilder {
  // Constants for adapt colors if is necessary
  COLOR_AREA = "#FF0101";
  COLOR_AREA_EMPTY = "#FBFBFB";
  COLOR_INNER = "#FFFFFF";

  /**
   * Constructor
   * @param dimOfCircularChart Dimensions of svg container
   * @param margins Margins in svg for the graph
   * @param svg svg container
   * @param userData Datas fetch from api
   */
  constructor(dimOfCircularChart, margins, svg, userData) {
    this.dimOfCircularChart = dimOfCircularChart;
    this.margins = margins;
    this.svg = svg;
    this.userData = userData;

    /**
     * Width of graph
     * @type {number}
     */
    this.graphWidth =
      this.dimOfCircularChart.width - this.margins.left - this.margins.right;
    /**
     * Height of the graph
     * @type {number}
     */
    this.graphHeight =
      this.dimOfCircularChart.height - this.margins.bottom - this.margins.top;

    // Init graph group
    this.graph = "";
  }

  /**
   * Build the graph
   */
  buildGraph = () => {
    this.initGraph();
    this.getGraph();
    this.getLabels();
  };

  /**
   *  Initialize the graph
   */
  initGraph = () => {
    // Move the center of the grapĥ
    const translateX = this.dimOfCircularChart.width / 2;
    const translateY = this.dimOfCircularChart.height / 2;

    /**
     * Group svg for graph elements
     * @type {SVGElement}
     */
    this.graph = this.svg
      .append("g")
      .attr("transform", `translate(${translateX}, ${translateY})`);
  };

  /**
   * Construct and get labels and title for the LinearChart
   */
  getLabels = () => {
    const label = this.graph.append("g").attr("font-weight", 500);

    // Title "Score"
    label
      .append("text")
      .text("Score")
      .attr("x", -this.graphWidth / 2)
      .attr("y", -this.graphHeight / 2);

    const pourcent = label.append("g");

    // Pourcents with interpolation
    pourcent
      .append("text")
      .attr("class", "pourcent-text")
      .attr("font-size", 18)
      .text(this.userData.todayScore * 100)
      .attr("x", -5)
      .transition()
      .duration(2000)
      .ease(d3.easeCircleOut)
      .textTween((d) => d3.interpolateRound(0, this.userData.todayScore * 100));
    pourcent
      .append("text")
      .attr("class", "pourcent-text")
      .attr("font-size", 18)
      .text("%")
      .attr("x", 15);

    // Subtitle
    const subtitle = pourcent
      .append("text")
      .attr("class", "pourcent-text")
      .attr("font-size", 12)
      .attr("opacity", 0.6);
    subtitle.append("tspan").text("de votre").attr("x", 0).attr("y", 30);
    subtitle.append("tspan").text("objectif").attr("x", 0).attr("y", 50);

    d3.selectAll(".pourcent-text").each((d, i, e) => {
      const w = e[i].getBBox().width;
      d3.select(e[i]).attr("transform", `translate(${-w / 2}, 0)`);
    });
  };

  /**
   * Construct the linearchart elements
   */
  getGraph = () => {
    /**
     * D3 Calcul angle of pie
     * @type {Array<PieArc>}
     */
    const pies = d3.pie().sort(null)([
      this.userData.todayScore,
      1 - this.userData.todayScore,
    ]);
    /**
     * D3 arcs rendered
     * @type {Arc}
     */
    const segments = d3.arc().innerRadius(80).outerRadius(90).cornerRadius(10);

    /**
     * Interpolate function for animation
     * @param d
     * @returns {function(*): *}
     */
    const interpolate = (d) => {
      const i = d3.interpolate(d.startAngle, d.endAngle);
      return (t) => {
        d.endAngle = i(t);
        return segments(d);
      };
    };

    // Add pie in the graph
    this.graph
      .append("g")
      .selectAll("path")
      .data(pies)
      .enter()
      .append("path")
      .attr("d", segments)
      .attr("fill", (d, i) =>
        i === 0 ? this.COLOR_AREA : this.COLOR_AREA_EMPTY
      )
      .transition()
      .duration(2000)
      .ease(d3.easeCircleOut)
      .attrTween("d", interpolate);

    this.graph.append("circle").attr("r", 80).attr("fill", this.COLOR_INNER);
  };
}

export default CircularChartBuilder;
