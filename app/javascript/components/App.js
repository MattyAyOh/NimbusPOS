import React from "react"

import AppContainer from "./assemble/AppContainer"

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
      <AppContainer>
        <Header/>

        { this.state.loaded && <Lobby services={this.state.services}/> }
      </AppContainer>
    );
  }
}

export default App
