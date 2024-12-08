import React from "react";
import { Form } from "react-bootstrap";

const Dropdown = ({ options, value, onChange }) => {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Select Metric</Form.Label>
        <Form.Control
          as="select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  );
};

export default Dropdown;
