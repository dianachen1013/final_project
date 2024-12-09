import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    console.log("Raw Data passed to LineChart:", data);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 60, bottom: 50, left: 60 };

    // 预处理数据
    const preparedData = data.map((d) => ({
      Year: d.Year.toString(), // 确保 Year 是字符串
      GDP: isNaN(+d.GDP) ? 0 : +d.GDP,
      Total: isNaN(+d.Total) ? 0 : +d.Total,
    }));

    console.log("Prepared Data:", preparedData);

    // 定义 x 轴
    const x = d3
      .scaleTime()
      .domain(d3.extent(preparedData, (d) => new Date(d.Year)))
      .range([margin.left, width - margin.right]);

    // 定义 y 轴
    const yGDP = d3
      .scaleLinear()
      .domain([0, d3.max(preparedData, (d) => d.GDP)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yTotal = d3
      .scaleLinear()
      .domain([0, d3.max(preparedData, (d) => d.Total)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // 绘制 GDP 曲线
    const gdpLine = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yGDP(d.GDP));

    console.log("GDP Line Path:", gdpLine(preparedData));

    svg
      .append("path")
      .datum(preparedData)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", gdpLine);

    // 绘制 Total Emission 曲线
    const totalLine = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yTotal(d.Total));

    console.log("Total Line Path:", totalLine(preparedData));

    svg
      .append("path")
      .datum(preparedData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", totalLine);

    // 添加坐标轴
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yGDP))
      .append("text")
      .attr("x", -margin.left / 2)
      .attr("y", margin.top)
      .attr("transform", "rotate(-90)")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("GDP (Hundred Million)");

    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yTotal))
      .append("text")
      .attr("x", -margin.right / 2)
      .attr("y", height / 2)
      .attr("transform", "rotate(90)")
      .attr("fill", "blue")
      .attr("text-anchor", "middle")
      .text("Total Emission (MT)");
  }, [data]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default LineChart;
