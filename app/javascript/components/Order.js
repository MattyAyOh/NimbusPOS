import React from "react"
import styled from "styled-components"

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
      This is a table! It has order information!
      </div>
    );
  }
}

export default Order
