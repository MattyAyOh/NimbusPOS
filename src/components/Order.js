import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

import TimeSpanInput from "./TimeSpanInput"
import Checkout from "./Checkout"
import Extras from "./Extras"
import TabView from "./TabView"
import Loading from "./Loading"

@observer
class Order extends React.Component {
  render() {
    return (
      this.props.store.order == null
      ? <Loading />
      : <Layout>
          <Links>
            <Link onClick={() => this.props.store.cancelOrder(this.props.store.order.service)} >
              Cancel Order
            </Link>

            <Link onClick={() => this.props.store.closeOrder(this.propss.order)}>Close</Link>
          </Links>

          <h2>{this.props.store.order.service.name} #{this.props.store.order.service.position}</h2>

          <TimeSpanInput
            hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
            store={this.props.store}
          />

          <TabView
            store={this.props.store}
            tabs={{
              snacks: () => <Extras store={this.props.store} type="snack" />,
              drinks: () => <Extras store={this.props.store} type="drink" />,
              other: () => <Extras store={this.props.store} type="other" />,
              checkout: () => <Checkout store={this.props.store} />
            }}
          />
        </Layout>
    )
  }
}

const Link = styled.span`
  color: #fff;
  text-decoration: underline;
`

const Layout = styled.div`
  background-color: #253241;
  color: #fff;
  display: grid;
  grid-template-rows: 4rem 1fr 1fr 80%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 4rem;
`

const Links = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
`

export default Order
