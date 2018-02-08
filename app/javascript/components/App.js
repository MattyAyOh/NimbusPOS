import React from "react"

import Application from "./assemble/Application"
import Layout from "./assemble/layouts/SingleColumn"
import SlideFromBottom from "./assemble/transitions/SlideFromBottom"
import Page from "./assemble/Page"
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
    fetch("/state").then((response) => response.json()).then((app_state) => {
      this.setState({ loaded: true, app: app_state })
    });
  }

  render () {
    return (
      <Application layout={Layout}>
        <Header/>

        { this.state.loaded
          ? <Lobby
              position={Layout.area(2, 1)}
              services={this.state.app.services}
              refresh={this.fetchState.bind(this)}
            />
          : <Loading position={Layout.area(2, 1)} />
        }

        <Page
          path="/table/:service/:number"
          component={(params) =>
            this.state.app
            ? <Order
                {...params}
                state={this.state.app}
                refresh={this.fetchState.bind(this)}
              />
            : null
          }
          position={Layout.area(2, 1)}
          transition={SlideFromBottom}
        />
      </Application>
    );
  }
}

export default App
