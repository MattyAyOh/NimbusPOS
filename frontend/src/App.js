import React from "react"
import styled from "styled-components"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import Reservations from "./components/Reservations"

class App extends React.Component {
  constructor() {
    super()

    this.state = { loaded: false }
  }

  componentDidMount() {
    this.fetchState()
  }

  fetchState(callback) {
    fetch("/state").then((response) => response.json()).then((app_state) => {
      this.setState({ loaded: true, app: app_state })

      if(callback) callback()
    });
  }

  render () {
    return (
      <Router>
        <Layout>
          <Header/>

          <Layout.Left>
            { this.state.loaded
            ?  <Lobby
                  services={this.state.app.services}
                  refresh={this.fetchState.bind(this)}
                />
            : <Loading/>
            }
          </Layout.Left>

          { this.state.loaded &&
            <Route
              path="/table/:service/:number"
              component={({match}) =>
                <Layout.Right>
                  <Order
                    params={match.params}
                    match={match}
                    state={this.state.app}
                    refresh={this.fetchState.bind(this)}
                  />
                </Layout.Right>
              }
            />
          }

          <Route
            path="/reservations"
            component={({ match }) =>
              <Layout.Right>
                <Reservations/>
              </Layout.Right>
            } />
        </Layout>
      </Router>
    );
  }
}

const Layout = styled.div`
  display: grid;
  grid-row-gap: 2rem;
  grid-template-columns: 50% 50%;
  grid-template-rows: 4rem 1fr;
  height: 100vh;
`

Layout.Left = styled.div`
  grid-area: 2 / 1 / -1 / 1;
`

Layout.Right = styled.div`
  grid-area: 1 / 2 / -1 / 2;
`

export default App
