import React from "react"
import styled from "styled-components"

import logo from "../images/logo.png"

const Header = () => (
  <div>
    <Logo src={logo} alt="Nimbus"/>
  </div>
)

const Logo = styled.img`
  height: 2rem;
`

export default Header
