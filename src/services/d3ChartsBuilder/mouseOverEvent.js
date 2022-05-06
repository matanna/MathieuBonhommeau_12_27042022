import * as d3 from "d3";

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
    });
    d3.select(node[i]).on("mouseout", (e) => {
      d3.select(node[i]) // Animation bars
        .attr("opacity", 0);
    });
  });
};

export default mouseOverEvent;
