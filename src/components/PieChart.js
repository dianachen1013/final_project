import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const PieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 200; // 缩小宽度
    const height = 200; // 缩小高度
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const legendHeight = 20;

    // Create pie chart
    const pieGroup = svg
      .attr("viewBox", `0 0 ${width + 100} ${height + 100}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    pieGroup
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
          .attr("x", x + width / 2 - 50)
          .attr("y", y + height / 2 - 50)
          .attr("text-anchor", "middle")
          .text(`${d.data.label}: ${d.data.value} (${d.data.percentage}%)`);
      })
      .on("mouseout", () => {
        svg.select("#tooltip").remove();
      });

    // Create legend
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${width}, 20)`);

    legendGroup
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", 0)
      .attr("y", (_, i) => i * legendHeight)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (_, i) => color(i));

    legendGroup
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", 20)
      .attr("y", (_, i) => i * legendHeight + 12)
      .text((d) => d.label)
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
