import React from "react"
import styled from "styled-components"

class Extra extends React.Component {
  constructor(props) {
    super()

    this.state = {
      quantity: props.quantity || 0,
    }
  }

  render () {
    return (
      <div className="nested-fields order-extra-fields tile">
        <div className="extra-name">{this.props.name}</div>

        <img src={this.props.image_url} className="img-thumbnail" width="100" />

        <div className="actions">
          <Button color="red" onClick={() => this.add(-1)}>-</Button>
          <span>{this.state.quantity}</span>
          <Button color="green" onClick={() => this.add(1)}>+</Button>
        </div>
      </div>
    );
  }

  add(value) {
    this.setState({ quantity: this.state.quantity + value })
  }
}

const Button = styled.span`
  display: inline-block;
  background-color: ${({color}) => color};
  color: white;
  max-width: 33%;
`

export default Extra
