import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

class Order extends React.Component {
  constructor() {
    super()

    this.timer = null

    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => this.fetchState(), 10000)
    this.fetchState()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  fetchState() {
    /*
    fetch("/state").then((response) => response.json()).then((json) => {
      this.setState({ loaded: true, services: json })
    });
    */
  }

  render () {
    return (
      <div>
        <Link to="/">Close</Link>
      </div>
    );
  }
}

export default Order
