import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const dataUrl =
  'https://raw.githubusercontent.com/bettyzzzr/fall2024-iv-final-project-data/refs/heads/main/15%E5%9B%BD%E7%A2%B3%E6%8E%92%E6%94%BE.csv';

const GridBaseHeatmap = ({ onGridClick = () => {} }) => {
  const svgRef = useRef();
  const [valueField, setValueField] = useState('population'); // Default field for color encoding

  useEffect(() => {
    d3.csv(dataUrl)
      .then((csvData) => {
        const processedData = preprocessData(csvData);
        renderHeatmap(processedData, svgRef, valueField, onGridClick);
      })
      .catch((error) => {
        console.error('Error loading the data:', error);
      });
  }, [valueField, onGridClick]);

  const preprocessData = (data) => {
    if (!data || data.length === 0) {
      console.warn('No data available');
      return [];
    }
    if (!data[0].year || !data[0].country || !data[0].co2_emissions) {
      console.error('Data format is incorrect. Expected columns: year, country, co2_emissions');
      return [];
    }

    const latestYear = d3.max(data, (d) => +d.year);
    const topCountries = data
      .filter((d) => +d.year === latestYear)
      .sort((a, b) => b.co2_emissions - a.co2_emissions)
      .slice(0, 15)
      .map((d) => d.country);

    return data.filter((d) => topCountries.includes(d.country));
  };

  const renderHeatmap = (data, svgRef, valueField, onGridClick) => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 40, left: 100 };

    svg.selectAll('.heatmap-group').remove(); // Only clear h
