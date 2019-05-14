import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { computed } from "mobx"

@observer
class Extra extends React.Component {
  render () {
    return (
      <Layout>
        <Image
          src={this.props.image_url}
          onClick={() => this.add(1)}
        />

        <Quantity>{this.props.name}</Quantity>

        <Decrement color="red" onClick={() => this.add(-1)}>-</Decrement>

        <Quantity>{this.quantity}</Quantity>

        <Decrement color="green" onClick={() => this.add(1)}>+</Decrement>
      </Layout>
    );
  }

  @computed get quantity() {
    const extra = this.props.assembly.visible_order.extras
      .filter((x) => x.extra.name === this.props.name)[0]
    return (extra && extra.quantity) || 0
  }

  add(value) {
    const quantity = this.quantity + value

    // TODO remove the ".orderLayout" DOM class from the application
    const layout = document.querySelector(".orderLayout")
    this.props.assembly.scroll = layout.scrollTop

    this.props.onPersist({ quantity: quantity }, this.props.name)
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
`

const Image = styled.img`
  grid-area: 1 / 1;
  width: 100px;
`

const Quantity = styled.div`
  color: #fff;
  text-align: center;
  vertical-align: center;
`

const Decrement = styled.div`
  background-color: ${({color}) => color};
  color: white;
  text-align: center;
  width: 3rem;
  height: 2rem;
  border-radius: 4px;
  font-size: 2rem;
  cursor: pointer;
`

export default Extra
