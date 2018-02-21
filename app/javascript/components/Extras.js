import React from "react"
import styled from "styled-components"

import Extra from "./Extra"

const Extras = (props) => (
  <Layout>
    {props.items.map((item) => (
      <Extra
        key={item.name}
        order={props.order}
        params={props.params}
        refresh={props.refresh}
        {...item}
      />
    ))}
  </Layout>
)

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
`

export default Extras
