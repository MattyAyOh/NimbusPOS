import React from "react"
import { BrowserRouter as Router } from "react-router-dom"

// TODO: use `this.props.layout` instead of hard-coding `layouts/SingleColumn`
import Layout from "./layouts/SingleColumn"

const AppContainer = ({ children }) => (
  <Router>
    <Layout>
      {children}
    </Layout>
  </Router>
)

export default AppContainer
