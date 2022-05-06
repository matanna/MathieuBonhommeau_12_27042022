import * as d3 from "d3";
import mouseOverEvent from "./mouseOverEvent";

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

    // Init graph group
    this.graph = "";
    // Init scales
    this.x = "";
    this.yKgs = "";
    this.yCalories = "";
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
    // Groups for bars
    this.graph = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.margins.left}, ${this.margins.top})`
      );

    // Get min and max of kgs, nbDay and calories for adapt scale of axis
    const minMaxKgs = d3.extent(this.activityDatas, (d) => d.kilogram);
    const minMaxCalories = d3.extent(this.activityDatas, (d) => d.calories);

    // Setup of axis X for NbDay and scale
    this.x = d3
      .scaleBand()
      .domain(this.activityDatas.map((d) => d.nbDay))
      .range([0, this.graphWidth])
      .paddingInner(0.95)
      .paddingOuter(0.06);

    // Setup of axis Y for Kgs and scale
    this.yKgs = d3
      .scaleLinear()
      .domain([minMaxKgs[0] - 1, minMaxKgs[1] + 1])
      .range([this.graphHeight, 0]);

    // Setup of axis Y for Calories and scale
    this.yCalories = d3
      .scaleLinear()
      .domain([minMaxCalories[0] - 100, minMaxCalories[1] + 100])
      .range([this.graphHeight, 0]);
  };

  /**
   * Construct and get labels and title for the BarChart
   */
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

  /**
   * Construct axes for the graph on x and y
   */
  getAxes() {
    // Group for axis X in graph group
    const AxisXgroup = this.graph
      .append("g")
      .attr("class", "axeX")
      .attr("transform", `translate(0, ${this.graphHeight})`);

    // Group for axis Y in graph group
    const AxisYgroup = this.graph
      .append("g")
      .attr("class", "axeY")
      .attr("transform", `translate(${this.graphWidth}, 0)`);

    // Creating Axis
    const axisX = d3.axisBottom(this.x).tickSize(0).tickPadding(20);
    const axisY = d3
      .axisRight(this.yKgs)
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

  /**
   * Construct the barchart elements
   */
  getGraph = () => {
    // Link all rect / bars to each datas
    const rects = this.graph.selectAll("rect").data(this.activityDatas);
    // Link all circle for rounded corner on each bars
    const circles = this.graph.selectAll("circle").data(this.activityDatas);

    // Elements displyed on mouseover event
    this.getOverElements(rects);
    // Bars for Kgs
    this.getBarsForKilos(rects, circles);
    // Bars for Calories
    this.getBarsForCalories(rects, circles);
  };

  /**
   * Construct bars to represent kilograms
   * @param rects D3 elements
   * @param circles D3 elements
   */
  getBarsForKilos(rects, circles) {
    rects
      .enter()
      .append("rect")
      .attr("stroke-width", 1)
      .attr("fill", "#282D30")
      .attr("width", this.x.bandwidth())
      .attr("pointer-events", "none")
      .attr("transform", `translate(-10, ${this.x.bandwidth() / 2})`)
      .attr("x", (d) => this.x(d.nbDay))
      //Initial height and y
      .attr("y", (d) => this.graphHeight - this.x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      // Final height and y
      .attr(
        "height",
        (d) => this.graphHeight - this.yKgs(d.kilogram) - this.x.bandwidth() / 2
      )
      .attr("y", (d) => this.yKgs(d.kilogram));

    // rounded corner on top
    circles
      .enter()
      .append("circle")
      .attr("r", this.x.bandwidth() / 2)
      .attr("fill", "#282D30")
      .attr("pointer-events", "none")
      .attr("transform", `translate(-10, 0)`)
      .attr("cx", (d) => this.x(d.nbDay) + this.x.bandwidth() / 2)
      // Initial cy
      .attr("cy", this.graphHeight - this.x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      //Final cy
      .attr("cy", (d) => this.yKgs(d.kilogram) + this.x.bandwidth() / 2);
  }

  /**
   * Construct bars to represent calories
   * @param rects D3 elements
   * @param circles D3 elements
   */
  getBarsForCalories(rects, circles) {
    rects
      .enter()
      .append("rect")
      .attr("stroke-width", 1)
      .attr("fill", "#E60000")
      .attr("width", this.x.bandwidth())
      .attr("pointer-events", "none")
      .attr("transform", `translate(10,${this.x.bandwidth() / 2})`)
      .attr("x", (d) => this.x(d.nbDay))
      // Initial height and y
      .attr("y", (d) => this.graphHeight - this.x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      // Final height and y
      .attr(
        "height",
        (d) =>
          this.graphHeight - this.yCalories(d.calories) - this.x.bandwidth() / 2
      )
      .attr("y", (d) => this.yCalories(d.calories));

    // rounded corner on top
    circles
      .enter()
      .append("circle")
      .attr("r", this.x.bandwidth() / 2)
      .attr("fill", "#E60000")
      .attr("pointer-events", "none")
      .attr("transform", `translate(10, 0)`)
      .attr("cx", (d) => this.x(d.nbDay) + this.x.bandwidth() / 2)
      // Initial cy
      .attr("cy", this.graphHeight - this.x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      //Final cy
      .attr("cy", (d) => this.yCalories(d.calories) + this.x.bandwidth() / 2);
  }

  /**
   * Construct elements whiwh are displayed on mouseover event
   * @param rects D3 elements
   */
  getOverElements = (rects) => {
    //Element displayed on mouseover
    rects.enter().append("g").attr("class", "overBarChart").attr("opacity", 0);

    d3.selectAll(".overBarChart")
      .append("rect")
      .attr("fill", "#C4C4C4")
      .attr("width", this.x.bandwidth() + 40)
      .attr("height", this.graphHeight)
      .attr("x", (d) => this.x(d.nbDay) - 20);
    d3.selectAll(".overBarChart")
      .append("rect")
      .attr("width", 39)
      .attr("height", 63)
      .attr("fill", this.CALORIES_BAR_COLOR)
      .attr("x", (d) => this.x(d.nbDay) + 42)
      .attr("y", -31);
    d3.selectAll(".overBarChart")
      .append("text")
      .attr("class", "text-overBarChart")
      .text((d) => `${d.kilogram}Kgs`)
      .attr("fill", "#FFFFFF")
      .attr("font-size", 8)
      .attr("alignment-baseline", "handing")
      .attr("x", (d) => this.x(d.nbDay) + 42)
      .attr("y", -10);
    d3.selectAll(".overBarChart")
      .append("text")
      .attr("class", "text-overBarChart")
      .text((d) => `${d.calories}Kcal`)
      .attr("fill", "#FFFFFF")
      .attr("font-size", 8)
      .attr("x", (d) => this.x(d.nbDay) + 42)
      .attr("y", +15);

    // Add mouse over event on graph
    mouseOverEvent("overBarChart");
  };
}

export default BarChartConstructor;
