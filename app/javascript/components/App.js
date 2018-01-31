import React from "react"
import styled from "styled-components"

import Header from "./Header"
import Lobby from "./Lobby"

class App extends React.Component {
  render () {
    return (
      <Page>
        <Header/>
        <Lobby/>
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
