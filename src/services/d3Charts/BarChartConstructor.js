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
   * Construct the barchart elements
   */
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
      .domain([minMaxKgs[0] - 1, minMaxKgs[1] + 1])
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

    // Axis for the graph
    this.getAxis(graph, x, yKgs);

    // Elements displayed when mouseover
    this.elementsOnMouseOver(rects, x);

    // Bars for Kgs
    this.getBarsForKilos(rects, circles, x, yKgs);

    // Bars for Calories
    this.getBarsForCalories(rects, circles, x, yCalories);
  };

  /**
   * Construct bars to represent kilograms
   * @param rects D3 elements
   * @param circles D3 elements
   * @param x D3 scale
   * @param yKgs D3 scale
   */
  getBarsForKilos(rects, circles, x, yKgs) {
    rects
      .enter()
      .append("rect")
      .attr("stroke-width", 1)
      .attr("fill", "#282D30")
      .attr("width", x.bandwidth())
      .attr("pointer-events", "none")
      .attr("transform", `translate(-10, ${x.bandwidth() / 2})`)
      .attr("x", (d) => x(d.nbDay))
      //Initial height and y
      .attr("y", (d) => this.graphHeight - x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      // Final height and y
      .attr(
        "height",
        (d) => this.graphHeight - yKgs(d.kilogram) - x.bandwidth() / 2
      )
      .attr("y", (d) => yKgs(d.kilogram));

    // rounded corner on top
    circles
      .enter()
      .append("circle")
      .attr("r", x.bandwidth() / 2)
      .attr("fill", "#282D30")
      .attr("pointer-events", "none")
      .attr("transform", `translate(-10, 0)`)
      .attr("cx", (d) => x(d.nbDay) + x.bandwidth() / 2)
      // Initial cy
      .attr("cy", this.graphHeight - x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      //Final cy
      .attr("cy", (d) => yKgs(d.kilogram) + x.bandwidth() / 2);
  }

  /**
   * Construct bars to represent calories
   * @param rects D3 elements
   * @param circles D3 elements
   * @param x D3 scale
   * @param yCalories D3 scale
   */
  getBarsForCalories(rects, circles, x, yCalories) {
    rects
      .enter()
      .append("rect")
      .attr("stroke-width", 1)
      .attr("fill", "#E60000")
      .attr("width", x.bandwidth())
      .attr("pointer-events", "none")
      .attr("transform", `translate(10,${x.bandwidth() / 2})`)
      .attr("x", (d) => x(d.nbDay))
      // Initial height and y
      .attr("y", (d) => this.graphHeight - x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      // Final height and y
      .attr(
        "height",
        (d) => this.graphHeight - yCalories(d.calories) - x.bandwidth() / 2
      )
      .attr("y", (d) => yCalories(d.calories));

    // rounded corner on top
    circles
      .enter()
      .append("circle")
      .attr("r", x.bandwidth() / 2)
      .attr("fill", "#E60000")
      .attr("pointer-events", "none")
      .attr("transform", `translate(10, 0)`)
      .attr("cx", (d) => x(d.nbDay) + x.bandwidth() / 2)
      // Initial cy
      .attr("cy", this.graphHeight - x.bandwidth() / 2)
      // Animation bars
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      //Final cy
      .attr("cy", (d) => yCalories(d.calories) + x.bandwidth() / 2);
  }

  /**
   * Construct axes for the graph on x and y
   * @param graph D3 group element
   * @param x D3 scale
   * @param yKgs D3 scale
   */
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

  /**
   * Construct elements whiwh are displayed on mouseover event
   * @param rects D3 elements
   * @param x D3 scale
   */
  elementsOnMouseOver = (rects, x) => {
    //Element displayed on mouseover
    rects.enter().append("g").attr("class", "overElement").attr("opacity", 0);

    d3.selectAll(".overElement")
      .append("rect")
      .attr("fill", "#C4C4C4")
      //.attr("fill-opacity", 0)
      .attr("width", x.bandwidth() + 40)
      .attr("height", this.graphHeight)
      .attr("x", (d) => x(d.nbDay) - 20);
    d3.selectAll(".overElement")
      .append("rect")
      .attr("width", 39)
      .attr("height", 63)
      .attr("fill", this.CALORIES_BAR_COLOR)
      .attr("x", (d) => x(d.nbDay) + 42)
      .attr("y", -31);
    d3.selectAll(".overElement")
      .append("text")
      .attr("class", "textOver")
      .text((d) => `${d.kilogram}Kgs`)
      .attr("fill", "#FFFFFF")
      .attr("font-size", 8)
      .attr("alignment-baseline", "handing")
      .attr("x", (d) => x(d.nbDay) + 42)
      .attr("y", -10);
    d3.selectAll(".overElement")
      .append("text")
      .attr("class", "textOver")
      .text((d) => `${d.calories}Kcal`)
      .attr("fill", "#FFFFFF")
      .attr("font-size", 8)
      .attr("x", (d) => x(d.nbDay) + 42)
      .attr("y", +15);

    d3.selectAll(".textOver").each((d, i, e) => {
      const w = e[i].getBBox().width;
      const x = (39 - w) / 2 + e[i].getBBox().x;
      d3.select(e[i]).attr("x", x);
    });

    d3.selectAll(".overElement").each((d, i, node) => {
      d3.select(node[i]).on("mouseover", (e) => {
        d3.select(node[i]) // Animation bars
          .attr("opacity", 1);
      });
      d3.select(node[i]).on("mouseleave", (e) => {
        d3.select(node[i]) // Animation bars
          .attr("opacity", 0);
      });
    });
  };
}

export default BarChartConstructor;
