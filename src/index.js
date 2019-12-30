import React from "react"
import ReactDOM from "react-dom"
import Assembly from "./Assembly"

import Aviator from "aviator"

import Lobby from "./components/Lobby"
import BigScreen from "./components/BigScreen"
import Admin from "./components/Admin"

const base = document.getElementById('root')
const assembly = new Assembly()

Aviator.setRoutes({
  "/":          () => window.assembly = ReactDOM.render(<Lobby assembly={assembly} />, base),
  "/admin":     () => window.assembly = ReactDOM.render(<Admin assembly={assembly} />, base),
  "/bigscreen": () => window.assembly = ReactDOM.render(<BigScreen assembly={assembly} />, base),
})

Aviator.dispatch()