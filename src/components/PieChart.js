import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const PieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 200; // Adjust width
    const height = 200; // Adjust height
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

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
      .attr("fill", (d, i) => color(i));

    // Create legend
    const legendHeight = 20;
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

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* SVG for Pie Chart */}
      <svg ref={svgRef}></svg>
      {/* Values and Percentages Below */}
      <div style={{ marginTop: "10px", fontSize: "12px", textAlign: "center" }}>
        {data.map((d, index) => (
          <p key={index} style={{ margin: "5px 0", color: d3.schemeCategory10[index % 10] }}>
            <strong>{d.label}:</strong> {d.value.toFixed(2)} ({d.percentage}%)
          </p>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
