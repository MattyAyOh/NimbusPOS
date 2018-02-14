import React from "react"
import { BrowserRouter as Router } from "react-router-dom"

/*
 * The `layout` prop should be a `div` created with `styled-components`,
 * which implements CSS grid layout.
 *
 * These requirements may relax in the future,
 * but we should try to keep that restriction in place as long as possible
 * as a simple yet powerful layout system.
 *
 * It is very likely that it will turn out to be all we need.
 */
const Application = ({ children, layout }) => (
  <Router>
    {React.createElement(layout, null, children)}
  </Router>
)

export default Application
