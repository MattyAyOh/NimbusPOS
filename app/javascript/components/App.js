import React from "react"
import styled from "styled-components"

import Header from "./Header"
import Lobby from "./Lobby"

class App extends React.Component {
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
    fetch("/state").then((response) => response.json()).then((json) => {
      this.setState({ loaded: true, services: json })
    });
  }

  render () {
    return (
      <Page>
        <Header/>

        { this.state.loaded && <Lobby services={this.state.services}/> }
      </Page>
    );
  }
}

const Page = styled.div`
  display: grid;
  grid-row-gap: 2rem;
  margin: 0px 20rem;
`

export default App
