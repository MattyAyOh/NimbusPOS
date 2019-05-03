import React from "react"
import ReactDOM from "react-dom"
import Assembly from "./Assembly"

ReactDOM.render(
  <Assembly
    afterCreation={(assembly) => window.assembly = assembly}
  />,
  document.getElementById('root'),
);
