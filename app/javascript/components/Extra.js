import React from "react"
import styled from "styled-components"

import jquery from "jquery"

class Extra extends React.Component {
  constructor(props) {
    super(props)

    const extra = props.order.extras.filter((x) => x.extra.name == props.name)[0]
    const quantity = (extra && extra.quantity) || 0

    this.state = {
      quantity: quantity,
      persisted: true,
    }
  }

  render () {
    return (
      <Layout>
        <Image
          src={this.props.image_url}
          onClick={() => this.add(1)}
        />

        <Quantity
          onClick={() => this.add(1)}
        >{this.state.quantity}
        </Quantity>
      </Layout>
    );
  }

  add(value) {
    const quantity = this.state.quantity + value

    this.persist({ quantity: quantity })
  }

  persist(state) {
    let params = this.props.params
    params["extra_name"] = this.props.name

    this.setState({ quantity: state.quantity, persisted: false })

    jquery.ajax({
      url: "/update/order_extra",
      type: "PUT",
      data: { params, state },
      success: (response) => {
        this.props.refresh()
        this.setState({ persisted: response.persisted })
      },
    })
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-rows: 1fr 2rem;
  align-items: center;
  justify-items: center;
`

const Image = styled.img`
  grid-area: 1 / 1;
  width: 100px;
`

const Quantity = styled.div`
  -webkit-text-stroke: 2px #000;
  color: #fff;
  font-size: 4rem;
  grid-area: 1 / 1;
  text-align: center;
  vertical-align: center;
`

export default Extra
