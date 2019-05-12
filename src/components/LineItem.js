import React from "react"
import styled from "styled-components"

import { observer } from "mobx-react"

@observer
class LineItem extends React.Component {
  layout = React.createRef()
  name = React.createRef()
  rate = React.createRef()
  quantity = React.createRef()
  amount = React.createRef()

  render = () => (
    <Layout container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      <span container={this.layout} ref={this.name} innerRef={React.createRef()} >{this.props.name}</span>
      <span container={this.layout} ref={this.rate} innerRef={React.createRef()} >{this.props.rate && `$${this.props.rate}`}</span>
      <span container={this.layout} ref={this.quantity} innerRef={React.createRef()} >{this.props.quantity}</span>
      <Right container={this.layout} ref={this.amount} innerRef={React.createRef()} >${this.props.amount}</Right>
    </Layout>
  )
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 2rem;
`

const Right = styled.span`
  text-align: right;
`

export default LineItem
