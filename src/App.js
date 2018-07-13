import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import Reservations from "./components/Reservations"
import Visor from "./Visor"

@observer
class App extends React.Component {
  render () {
    return (
      <Layout>
        <Header/>

        <Visor store={this.props.store} />

        <Layout.Left>
          { this.props.store.loaded
          ? <Lobby store={this.props.store} />
          : <Loading/>
          }
        </Layout.Left>

        <Layout.Right>
          { this.props.store.loaded &&
            this.props.store.currentView.get("name") === "order" &&
            <Order store={this.props.store} />
          }

          { this.props.store.currentView.get("name") === "reservations" &&
            <Reservations reservations={this.props.store.reservations} />
          }
        </Layout.Right>
      </Layout>
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
