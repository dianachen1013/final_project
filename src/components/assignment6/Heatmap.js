import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Heatmap = ({ data, metric, onCellClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const x = d3
      .scaleBand()
      .domain([...new Set(data.map((d) => d.Year))])
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleBand()
      .domain([...new Set(data.map((d) => d.Country))])
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const color = d3
      .scaleSequential(d3.interpolateGreens)
      .domain(d3.extent(data, (d) => +d[metric]));

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.Year))
      .attr("y", (d) => y(d.Country))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(+d[metric]))
      .on("click", (event, d) => onCellClick(d));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
  }, [data, metric, onCellClick]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default Heatmap;
