import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 100, bottom: 50, left: 100 };

    // Parse years as integers (if not already)
    const years = data.map((d) => +d.Year);

    // Scales
    const x = d3
      .scaleLinear() // Use a linear scale for years
      .domain(d3.extent(years)) // Get min and max of the years (2003 to 2023)
      .range([margin.left, width - margin.right]);

    const y1 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.GDP)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const y2 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.Total)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes
    const xAxis = d3.axisBottom(x).tickFormat(d3.format("d")); // Display years as integers
    const yAxisLeft = d3.axisLeft(y1);
    const yAxisRight = d3.axisRight(y2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisLeft);

    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(yAxisRight);

    // Add labels for Y axes
    svg
      .append("text")
      .attr("y", margin.left - 70)
      .attr("x", margin.left + 40)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "blue") // Set the label color to blue
      .text("GDP (Hundred M)");


    svg
      .append("text")
      .attr("y", margin.top - 20)
      .attr("x", width - margin.right - 40)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("CO2 Emissions (Metric tons)");

    // Line for GDP
    const lineGDP = d3
      .line()
      .x((d) => x(+d.Year)) // Use the numeric year value
      .y((d) => y1(+d.GDP));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", lineGDP);

    // Line for CO2 Emissions
    const lineCO2 = d3
      .line()
      .x((d) => x(+d.Year)) // Use the numeric year value
      .y((d) => y2(+d.Total));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", lineCO2);
  }, [data]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default LineChart;
