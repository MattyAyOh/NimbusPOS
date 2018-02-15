import React from "react"
import styled from "styled-components"

import Application from "./assemble/Application"
import SlideFromBottom from "./assemble/transitions/SlideFromBottom"
import Page from "./assemble/Page"
import Loading from "./assemble/Loading"

import Header from "./Header"
import Lobby from "./Lobby"
import Order from "./Order"

// This layout gives us four grid spaces
const Layout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 50% 50%;
  grid-template-rows: 4rem 1fr;
`

// Top right to bottom right
const layoutRight = "grid-area: 1 / 2 / -1 / 2"
// Bottom left
const layoutLeft = "grid-area: 2 / 1"

class App extends React.Component {
  constructor() {
    super()

    this.timer = null
    this.state = { loaded: false }
  }

  componentDidMount() {
    this.fetchState()
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
              position={layoutLeft}
              services={this.state.app.services}
              refresh={this.fetchState.bind(this)}
            />
          : <Loading position={layoutLeft}/>
        }

        { this.state.loaded &&
          <Page
            path="/table/:service/:number"
            component={(params) =>
              <Order
                {...params}
                state={this.state.app}
                refresh={this.fetchState.bind(this)}
              />
            }
            position={layoutRight}
            transition={SlideFromBottom}
          />
        }
      </Application>
    );
  }
}

export default App
