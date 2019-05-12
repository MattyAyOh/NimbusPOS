import React from "react"
import styled from "styled-components"

import Extra from "./Extra"

import { observer } from "mobx-react"

@observer
class Extras extends React.Component {
  layout = React.createRef()

  render = () => (
    <Layout contaainer={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      {this.props.items.map((item) => (
        <Extra
          onPersist={this.props.onPersist}
          key={item.name}
          order={this.props.order}
          {...item}
        />
      ))}
    </Layout>
  )
}

const Layout = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-row-gap: 1rem;
`

export default Extras
