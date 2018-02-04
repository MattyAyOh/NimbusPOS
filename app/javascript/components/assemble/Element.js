import React from "react"
import styled from "styled-components"

const Element = (props) => (
  <Layout position={props.position}>
    Element
  </Layout>
)

const Layout = styled.div`
  ${(p) => p.position};
`

export default Element
