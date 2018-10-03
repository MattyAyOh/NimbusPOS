import React from "react"
import styled from "styled-components"

import logo from "../images/logo.svg"

import { observer } from "mobx-react"

const Header = observer(() => (
  <Layout>
    <Logo src={logo} alt="Nimbus"/>
  </Layout>
))

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
