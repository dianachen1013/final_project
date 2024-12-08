import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const LineChart = ({ dataUrl }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load the CSV data from the URL
    d3.csv(dataUrl).then((loadedData) => {
      // Process and clean the data
      const processedData = loadedData.map((d) => ({
        Year: d.Year,
        Total: +d.Total, // Convert Total CO2 emissions to numbers
        GDP: +d.GDP, // Convert GDP to numbers
      }));
      setData(processedData); // Set the cleaned data
    });
  }, [dataUrl]);

  useEffect(() => {
    if (!data || data.length === 0) return; // Wait until data is loaded

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous contents

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 60, bottom: 30, left: 50 };

    // Define the x-scale (time)
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.Year)))
      .range([margin.left, width - margin.right]);

    // Define the y-scale for "Total"
    const yTotal = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Total)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Define the y-scale for "GDP"
    const yGDP = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.GDP)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Line generator for "Total"
    const lineTotal = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yTotal(d.Total));

    // Line generator for "GDP"
    const lineGDP = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yGDP(d.GDP));

    // Append the "Total" line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineTotal);

    // Append the "GDP" line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4 2") // Dashed line for differentiation
      .attr("d", lineGDP);

    // Append x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

    // Append y-axis for "Total"
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yTotal));
    svg
      .append("text")
      .attr("x", margin.left - 30)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "end")
      .attr("fill", "steelblue")
      .style("font-size", "12px")
      .text("Total CO2 Emissions (Megatons)");

    // Append y-axis for "GDP"
    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yGDP));
    svg
      .append("text")
      .attr("x", width - margin.right + 40)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "start")
      .attr("fill", "orange")
      .style("font-size", "12px")
      .text("GDP (Billion USD)");

    // Add legend
    svg
      .append("circle")
      .attr("cx", width - margin.right - 120)
      .attr("cy", margin.top)
      .attr("r", 5)
      .style("fill", "steelblue");
    svg
      .append("text")
      .attr("x", width - margin.right - 110)
      .attr("y", margin.top + 5)
      .text("Total CO2 Emissions")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    svg
      .append("circle")
      .attr("cx", width - margin.right - 120)
      .attr("cy", margin.top + 20)
      .attr("r", 5)
      .style("fill", "orange");
    svg
      .append("text")
      .attr("x", width - margin.right - 110)
      .attr("y", margin.top + 25)
      .text("GDP")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  }, [data]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default LineChart;
