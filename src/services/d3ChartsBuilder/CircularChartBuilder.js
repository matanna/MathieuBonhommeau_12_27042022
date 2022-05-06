import * as d3 from "d3";

class RadarCircularBuilder {
  COLOR_AREA = "#FF0101";
  COLOR_AREA_EMPTY = "#FBFBFB";
  COLOR_INNER = "#FFFFFF";

  constructor(dimOfCircularChart, margins, svg, userData) {
    // Dimensions of svg container
    this.dimOfCircularChart = dimOfCircularChart;
    // Margins in svg for the graph
    this.margins = margins;
    // svg container
    this.svg = svg;
    // Datas fetch from api
    this.userData = userData;

    // Real dimensions of the graph
    this.graphWidth =
      this.dimOfCircularChart.width - this.margins.left - this.margins.right;
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
    this.graph = this.svg
      .append("g")
      .attr("transform", `translate(${translateX}, ${translateY})`);
  };

  /**
   * Construct and get labels and title for the LinearChart
   */
  getLabels = () => {
    const label = this.graph.append("g").attr("font-weight", 500);

    label
      .append("text")
      .text("Score")
      .attr("x", -this.graphWidth / 2)
      .attr("y", -this.graphHeight / 2);

    const pourcent = label.append("g");
    pourcent
      .append("text")
      .attr("class", "pourcent-text")
      .text(this.userData.score * 100 + "%")
      .attr("font-size", 18);

    const subtitle = pourcent
      .append("text")
      .attr("class", "pourcent-text")
      .attr("font-size", 12)
      .attr("opacity", 0.6);
    subtitle.append("tspan").text("de votre").attr("x", 0).attr("y", 30);
    subtitle.append("tspan").text("objectif").attr("x", 0).attr("y", 50);

    d3.selectAll(".pourcent-text").each((d, i, e) => {
      console.log(e[i].getBBox().width);
      const w = e[i].getBBox().width;
      d3.select(e[i]).attr("transform", `translate(${-w / 2}, 0)`);
    });
  };

  /**
   * Construct the linearchart elements
   */
  getGraph = () => {
    // Calcul angle of pie
    const pies = d3.pie().sort(null)([
      this.userData.score,
      1 - this.userData.score,
    ]);
    const segments = d3.arc().innerRadius(80).outerRadius(90).cornerRadius(10);
    // Interpolate function for animation
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
      .duration(1000)
      .ease(d3.easeCircleOut)
      .attrTween("d", interpolate);

    this.graph.append("circle").attr("r", 80).attr("fill", this.COLOR_INNER);
  };
}

export default RadarCircularBuilder;
