import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const PieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .on("mouseover", (event, d) => {
        const [x, y] = d3.pointer(event);
        svg
          .append("text")
          .attr("id", "tooltip")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .text(`${d.data.label}: ${d.data.value} (${d.data.percentage}%)`);
      })
      .on("mouseout", () => {
        svg.select("#tooltip").remove();
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
