import * as d3 from "d3";

/**
 * Function for change opacity on element when mouseover or mouseout
 * @param className The name of the class element we want to be affected
 */
const mouseOverEvent = (className) => {
  d3.selectAll(`.text-${className}`).each((d, i, e) => {
    const w = e[i].getBBox().width;
    const x = (39 - w) / 2 + e[i].getBBox().x;
    d3.select(e[i]).attr("x", x);
  });

  d3.selectAll(`.${className}`).each((d, i, node) => {
    d3.select(node[i]).on("mouseover", (e) => {
      d3.select(node[i]) // Animation bars
        .attr("opacity", 1);
      if (className === "overLinearChart") {
        d3.selectAll(".layer").each((d, j, node) => {
          i === j && d3.select(node[j]).attr("opacity", 0.2);
        });
      }
    });
    d3.select(node[i]).on("mouseout", (e) => {
      d3.select(node[i]) // Animation bars
        .attr("opacity", 0);
      if (className === "overLinearChart") {
        d3.selectAll(".layer").each((d, j, node) => {
          i === j && d3.select(node[j]).attr("opacity", 0);
        });
      }
    });
  });
};
export default mouseOverEvent;
