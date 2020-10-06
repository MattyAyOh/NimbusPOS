import Aviator from "aviator"
import React from "react"
import ReactDOM from "react-dom"

import Assembly from "./Assembly"
import graph from "./graph"

import Lobby from "./components/Lobby"
import BigScreen from "./components/BigScreen"
import Admin from "./components/Admin"

const base = document.getElementById('root')

window.graph = graph
window.assembly = new Assembly(graph)

Aviator.setRoutes({
  "/":          () => ReactDOM.render(<Lobby assembly={window.assembly} />, base),
  "/admin":     () => ReactDOM.render(<Admin assembly={window.assembly} />, base),
  "/bigscreen": () => ReactDOM.render(<BigScreen assembly={window.assembly} />, base),
  "/checkout":  () => ReactDOM.render(<Checkout assembly={window.assembly} />, base),
})

Aviator.dispatch()