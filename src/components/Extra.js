import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

@observer
class Extra extends React.Component {
  render () {
    return (
      <Layout>
        <Image
          src={this.props.image_url}
          onClick={() => this.props.store.incrementExtraQuantity(this.props.extra, 1)}
        />

        <Quantity
          onClick={() => this.props.store.incrementExtraQuantity(this.props.extra, 1)}
        >
          {this.props.store.lineItemForExtra(this.props.extra).quantity}
        </Quantity>

        <Decrement
          color="red"
          onClick={() => this.props.store.incrementExtraQuantity(this.props.extra, -1)}
        >-</Decrement>
      </Layout>
    );
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
