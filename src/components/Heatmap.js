import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const dataUrl =
  "https://raw.githubusercontent.com/bettyzzzr/fall2024-iv-final-project-data/refs/heads/main/15%E5%9B%BD%E7%A2%B3%E6%8E%92%E6%94%BE.csv";

const Heatmap = ({ onGridClick }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState("Population"); // Default metric
  const [annotation, setAnnotation] = useState(null); // State for annotation box

  useEffect(() => {
    // Load data from the URL
    d3.csv(dataUrl)
      .then((csvData) => {
        csvData.forEach((d) => {
          d.Year = +d.Year; // Ensure Year is numeric
          d.Total = +d.Total;
          d.Population = +d.Population;
          d.GDP = +d.GDP;
        });
        setData(csvData);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 20, bottom: 50, left: 100 };

    // Extract years dynamically from the dataset
    const years = Array.from(new Set(data.map((d) => d.Year)))
      .filter((year) => year >= 2003 && year <= 2023)
      .sort((a, b) => a - b);

    // Sort countries by total emission in descending order
    const countries = Array.from(new Set(data.map((d) => d.Country)))
      .sort((a, b) => {
        const totalA = data
          .filter((d) => d.Country === a)
          .reduce((sum, d) => sum + d.Total, 0);
        const totalB = data
          .filter((d) => d.Country === b)
          .reduce((sum, d) => sum + d.Total, 0);
        return totalB - totalA;
      });

    // Scales
    const x = d3.scaleBand().domain(years).range([margin.left, width - margin.right]).padding(0.1);
    const y = d3.scaleBand().domain(countries).range([margin.top, height - margin.bottom]).padding(0.1);

    // Use a logarithmic scale for smoother color transitions
    const color = d3
      .scaleSequential(d3.interpolateGreens)
      .domain(d3.extent(data, (d) => Math.log10(d[metric] || 1))); // Avoid log(0)

    // Use size scale for CO2 emissions
    const size = d3
      .scaleSqrt()
      .domain(d3.extent(data, (d) => d.Total))
      .range([2, x.bandwidth() / 2]);

    // Create heatmap squares
    svg
      .append("g")
      .selectAll("rect")
      .data(data.filter((d) => years.includes(d.Year)))
      .join("rect")
      .attr("x", (d) => x(d.Year))
      .attr("y", (d) => y(d.Country))
      .attr("width", (d) => size(d.Total)) // Size based on CO2 emissions
      .attr("height", (d) => size(d.Total))
      .attr("fill", (d) => color(Math.log10(d[metric] || 1))) // Log-transformed color
      .on("click", (event, d) => {
        // Update annotation box on click
        setAnnotation({
          x: event.pageX,
          y: event.pageY,
          data: d,
        });
        onGridClick(d); // Trigger parent click handler
      });

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add y-axis
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    // Add title for y-axis
    svg
      .append("text")
      .attr("x", margin.left - 50)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Countries");
  }, [data, metric, onGridClick]); // Update when data or metric changes

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Dropdown Menu */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="metric-select" style={{ marginRight: "10px" }}>
          Select Metric:
        </label>
        <select id="metric-select" value={metric} onChange={handleMetricChange}>
          <option value="Population">Population</option>
          <option value="GDP">GDP</option>
        </select>
      </div>

      {/* Heatmap SVG */}
      <svg ref={svgRef} width={800} height={400}></svg>

      {/* Annotation Box */}
      {annotation && (
        <div
          style={{
            position: "absolute",
            top: annotation.y + 10,
            left: annotation.x + 10,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <p><strong>Country:</strong> {annotation.data.Country}</p>
          <p><strong>Year:</strong> {annotation.data.Year}</p>
          <p><strong>GDP:</strong> {annotation.data.GDP}</p>
          <p><strong>Population:</strong> {annotation.data.Population}</p>
          <p><strong>CO2 Emissions:</strong> {annotation.data.Total}</p>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
