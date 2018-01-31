import React from "react"
import styled from "styled-components"

import logo from "../images/logo.png"

const Header = () => (
  <Layout>
    <Logo src={logo} alt="Nimbus"/>
  </Layout>
)

const Layout = styled.div`
  height: 4rem;
`

const Logo = styled.img`
  height: 2rem;
`

export default Header
