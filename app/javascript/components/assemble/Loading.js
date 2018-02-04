import React from "react"
import styled from "styled-components"

const Loading = (props) => (
  <Layout position={props.position}>
    Loading...
  </Layout>
)

const Layout = styled.div`
  ${(p) => p.position};
`

export default Loading
