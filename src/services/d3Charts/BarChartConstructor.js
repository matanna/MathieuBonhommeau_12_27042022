import * as d3 from "d3";

class BarChartConstructor {
  KGS_BAR_COLOR = "#282D30";
  CALORIES_BAR_COLOR = "#E60000";
  TEXT_AXIS_COLOR = "#74798C";

  constructor(dimOfBarChart, margins, svg, activityDatas) {
    // Dimensions of svg container
    this.dimOfBarChart = dimOfBarChart;

    // Margins in svg for the graph
    this.margins = margins;

    // svg container
    this.svg = svg;

    // Datas fetch from api
    this.activityDatas = activityDatas;

    // Real dimensions of the graph
    this.graphWidth =
      this.dimOfBarChart.width - 20 - this.margins.right - this.margins.left;
    this.graphHeight =
      this.dimOfBarChart.height - this.margins.top - this.margins.bottom;
  }

  getLabels = () => {
    const head = this.svg
      .append("g")
      .attr("x", 0)
      .attr(
        "transform",
        `translate(${this.margins.left}, ${this.margins.top / 2})`
      );

    // Principal title
    head.append("text").text("Activité quotidienne").attr("font-weight", "500");

    // Group Labels
    const label = head
      .append("g")
      .attr("width", `${this.graphWidth * 0.5}`)
      .attr("transform", `translate(${this.graphWidth - 202}, 0)`);

    // Label "Poids"
    const weight = label.append("g");
    weight
      .append("circle")
      .attr("r", 4)
      .attr("cx", 0)
      .attr("cy", -5)
      .attr("fill", this.KGS_BAR_COLOR);
    weight
      .append("text")
      .text("Poids (kg)")
      .attr("fill", this.TEXT_AXIS_COLOR)
      .attr("transform", `translate(12, 0)`);

    // Label "Calories"
    const calories = label.append("g").attr("transform", "translate(100, 0)");
    calories
      .append("circle")
      .attr("r", 4)
      .attr("cx", 0)
      .attr("cy", -5)
      .attr("fill", this.CALORIES_BAR_COLOR);
    calories
      .append("text")
      .text("Calories brulées (kCal)")
      .attr("fill", this.TEXT_AXIS_COLOR)
      .attr("class", "caloriesLabel")
      .attr("x", "0%")
      .attr("transform", `translate(16, 0)`);
  };

  getGraph = () => {
    // Groups for bars
    const graph = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.margins.left}, ${this.margins.top})`
      );

    // Get min and max of kgs, nbDay and calories for adapt scale of axis
    const minMaxKgs = d3.extent(this.activityDatas, (d) => d.kilogram);
    const minMaxCalories = d3.extent(this.activityDatas, (d) => d.calories);

    // Setup of axis X for NbDay and scale
    const x = d3
      .scaleBand()
      .domain(this.activityDatas.map((d) => d.nbDay))
      .range([0, this.graphWidth])
      .paddingInner(0.95)
      .paddingOuter(0.06);

    // Setup of axis Y for Kgs and scale
    const yKgs = d3
      .scaleLinear()
      .domain([minMaxKgs[0] - 1, minMaxKgs[1]])
      .range([this.graphHeight, 0]);

    // Setup of axis Y for Calories and scale
    const yCalories = d3
      .scaleLinear()
      .domain([minMaxCalories[0] - 100, minMaxCalories[1] + 100])
      .range([this.graphHeight, 0]);

    // Link all rect / bars to each datas
    const rects = graph.selectAll("rect").data(this.activityDatas);
    // Link all circle for rounded corner on each bars
    const circles = graph.selectAll("circle").data(this.activityDatas);

    // Bars for Kgs
    this.getBarsForKilos(rects, circles, x, yKgs);

    // Bars for Calories
    this.getBarsForCalories(rects, circles, x, yCalories);

    // Axis for the graph
    this.getAxis(graph, x, yKgs);
  };

  getBarsForKilos(rects, circles, x, yKgs) {
    rects
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .attr(
        "height",
        (d) => this.graphHeight - yKgs(d.kilogram) - x.bandwidth() / 2
      )
      .attr("stroke-width", 1)
      .attr("x", (d) => x(d.nbDay))
      .attr("y", (d) => yKgs(d.kilogram))
      .attr("fill", "#282D30")
      .attr("transform", `translate(-10, ${x.bandwidth() / 2})`);
    // rounded corner on top
    circles
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.nbDay) + x.bandwidth() / 2)
      .attr("cy", (d) => yKgs(d.kilogram) + x.bandwidth() / 2)
      .attr("r", x.bandwidth() / 2)
      .attr("fill", "#282D30")
      .attr("transform", `translate(-10, 0)`);
  }

  getBarsForCalories(rects, circles, x, yCalories) {
    rects
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .attr(
        "height",
        (d) => this.graphHeight - yCalories(d.calories) - x.bandwidth() / 2
      )
      .attr("stroke-width", 1)
      .attr("x", (d) => x(d.nbDay))
      .attr("y", (d) => yCalories(d.calories))
      .attr("fill", "#E60000")
      .attr("transform", `translate(10,${x.bandwidth() / 2})`);
    // rounded corner on top
    circles
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.nbDay) + x.bandwidth() / 2)
      .attr("cy", (d) => yCalories(d.calories) + x.bandwidth() / 2)
      .attr("r", x.bandwidth() / 2)
      .attr("fill", "#E60000")
      .attr("transform", `translate(10, 0)`);
  }

  getAxis(graph, x, yKgs) {
    // Group for axis X in graph group
    const AxisXgroup = graph
      .append("g")
      .attr("class", "axeX")
      .attr("transform", `translate(0, ${this.graphHeight})`);

    // Group for axis Y in graph group
    const AxisYgroup = graph
      .append("g")
      .attr("class", "axeY")
      .attr("transform", `translate(${this.graphWidth}, 0)`);

    // Creating Axis
    const axisX = d3.axisBottom(x).tickSize(0).tickPadding(20);
    const axisY = d3
      .axisRight(yKgs)
      .ticks(3)
      .tickSize(-this.graphWidth)
      .tickPadding(45);

    // Insert Axis
    AxisXgroup.call(axisX)
      .style("color", "#9B9EAC")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .select("path");

    AxisYgroup.call(axisY)
      .style("color", "#9B9EAC")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .select("path")
      .attr("stroke", "#FBFBFB");

    // Axe y ticks style
    const axeY = d3.select(".axeY");
    axeY.select(".tick line").remove();
    axeY
      .selectAll(".tick line")
      .attr("stroke-dasharray", "3")
      .attr("stroke", "#DEDEDE");
  }
}

export default BarChartConstructor;
