import React from "react"
import styled from "styled-components"

import server from "../server"

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

        <Decrement color="red" onClick={() => this.add(-1)}>-</Decrement>
      </Layout>
    );
  }

  add(value) {
    const quantity = this.state.quantity + value

    this.persist({ quantity: quantity })
  }

  persist(state) {
    this.setState({ quantity: state.quantity, persisted: false })

    server(`
      service = Service.find_by(
        service_type: ${JSON.stringify(this.props.params.service)},
        position: ${JSON.stringify(this.props.params.number)},
      )

      order = service.current_order || Order.create!(service: service)
      extra = Extra.find_by(name: ${JSON.stringify(this.props.name)})

      order_extra =
        OrderExtra.find_by(order: order, extra: extra) ||
        OrderExtra.create!(order: order, extra: extra)

      if(${JSON.stringify(state.quantity)}.to_i > 0)
        result = order_extra.update!(
          quantity: ${JSON.stringify(state.quantity)},
        )
      else
        order_extra.destroy!
      end

      { persisted: result }
    `).then((response) => {
      this.props.refresh()
      this.setState({ persisted: response.persisted })
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

const Decrement = styled.div`
  background-color: ${({color}) => color};
  color: white;
  grid-row: 2;
  text-align: center;
  width: 100%;
`

export default Extra
