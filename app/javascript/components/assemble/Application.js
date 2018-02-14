import React from "react"
import { BrowserRouter as Router } from "react-router-dom"

const Application = ({ children, layout }) => (
  <Router>
    {React.createElement(layout, null, children)}
  </Router>
)

export default Application
