import React from "react"
import styled from "styled-components"

import logo from "../images/logo.svg"

import { observer } from "mobx-react"

@observer
class Header extends React.Component {
  layout = React.createRef()
  logo = React.createRef()

  render = () => (
    <Layout container={this.props.container} ref={this.layout} innerRef={React.createRef} >
      <Logo
        container={this.layout} ref={this.logo} innerRef={React.createRef}
        src={logo} alt="Nimbus"
      />
    </Layout>
  )
}

const Layout = styled.div`
  align-items: flex-end;
  display: flex;
  height: 4rem;
  justify-content: center;
`

const Logo = styled.img`
  height: 2rem;
`

export default Header
