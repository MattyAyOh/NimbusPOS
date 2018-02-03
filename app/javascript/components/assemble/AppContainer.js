import React from "react"
import { BrowserRouter as Router } from "react-router-dom"

// TODO: use `this.props.layout` instead of hard-coding `layouts/Default`
import Layout from "./layouts/Default"

const AppContainer = ({ children }) => (
  <Router>
    <Layout>
      {children}
    </Layout>
  </Router>
)

export default AppContainer
