import React from "react"

import AppContainer from "./assemble/AppContainer"
import Layout from "./assemble/layouts/SingleColumn"
import SlideFromBottom from "./assemble/transitions/SlideFromBottom"
import Element from "./assemble/Element"
import Loading from "./assemble/Loading"

import Header from "./Header"
import Lobby from "./Lobby"
import Order from "./Order"

class App extends React.Component {
  constructor() {
    super()

    this.timer = null
    this.state = { loaded: false }
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
      <AppContainer layout={Layout}>
        <Header/>

        { this.state.loaded
          ? <Lobby services={this.state.services}/>
          : <Loading/>
        }

        <Element
          path="/table/:id"
          component={Order}
          position={Layout.row("2")}
          transition={SlideFromBottom}
        />
      </AppContainer>
    );
  }
}

export default App
