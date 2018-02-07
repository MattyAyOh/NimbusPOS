import React from "react"
import styled from "styled-components"

import jquery from "jquery"

class Extra extends React.Component {
  constructor(props) {
    super()

    const service = props.params.service

    const order = props
      .state
      .services
      .filter(s => s.service == props.params.service && s.position == props.params.number)[0]
      .current_order

    const extra = order.extras.filter((x) => x.extra.name == props.name)[0]
    const quantity = (extra && extra.quantity) || 0

    this.state = {
      quantity: quantity,
      persisted: true,
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
    const quantity = this.state.quantity + value

    this.persist({ quantity: quantity })
  }

  persist = (state) => {
    let params = this.props.params
    params["extra_name"] = this.props.name

    this.setState({ quantity: state.quantity, persisted: false })

    jquery.ajax({
      url: "/update_order",
      type: "PUT",
      data: { params, state },
      success: (response) => this.setState({ persisted: response.persisted }),
    })

    this.setState({ persisted: true })
  }
}

const Button = styled.span`
  display: inline-block;
  background-color: ${({color}) => color};
  color: white;
  max-width: 33%;
`

export default Extra
