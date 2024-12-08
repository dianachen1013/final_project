import React, { useState, useEffect } from "react";
import { csv } from "d3";
import { Container, Row, Col } from "react-bootstrap";
import Heatmap from "../components/Heatmap";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";

const dataUrl =
  "https://raw.githubusercontent.com/bettyzzzr/fall2024-iv-final-project/refs/heads/main/15%E5%9B%BD%E7%A2%B3%E6%8E%92%E6%94%BE.csv";

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    // Load data from the URL
    csv(dataUrl).then((parsedData) => {
      setData(parsedData);
    });
  }, []);

  const handleCellClick = (data) => {
    setSelectedData(data);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Population & GDP Analysis</h1>
          {data.length > 0 ? (
            <Heatmap data={data} metric="Population" onCellClick={handleCellClick} />
          ) : (
            <p>Loading data...</p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {selectedData && <PieChart data={preparePieChartData(selectedData)} />}
        </Col>
        <Col>
          {selectedData && <LineChart data={prepareLineChartData(data, selectedData)} />}
        </Col>
      </Row>
    </Container>
  );
}

function preparePieChartData(selectedData) {
  const { Coal, Oil, Gas, Cement, Flaring, Other } = selectedData;
  const total = Coal + Oil + Gas + Cement + Flaring + Other;
  return [
    { label: "Coal", value: Coal, percentage: ((Coal / total) * 100).toFixed(2) },
    { label: "Oil", value: Oil, percentage: ((Oil / total) * 100).toFixed(2) },
    { label: "Gas", value: Gas, percentage: ((Gas / total) * 100).toFixed(2) },
    { label: "Cement", value: Cement, percentage: ((Cement / total) * 100).toFixed(2) },
    { label: "Flaring", value: Flaring, percentage: ((Flaring / total) * 100).toFixed(2) },
    { label: "Other", value: Other, percentage: ((Other / total) * 100).toFixed(2) },
  ];
}

function prepareLineChartData(data, selectedData) {
  return data
    .filter((d) => d.Country === selectedData.Country)
    .map((d) => ({ Year: d.Year, value: d.Total, GDP: d["GDP(usd/one trillion)"] }));
}
