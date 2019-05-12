import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"
import { withRouter } from "react-router-dom"

const blue = "#4a90e2"
const grey = "#afb5bd"

@observer
class Table extends React.Component {
  layout = React.createRef()
  time = React.createRef()
  number = React.createRef()
  price = React.createRef()

  render = () => (
    <Layout container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      <Time container={this.layout} ref={this.time} innerRef={React.createRef()} >
        { this.props.service.current_order &&
          DateTime
          .fromISO(this.props.service.current_order.start_time)
          .toLocaleString(DateTime.TIME_24_SIMPLE)
        }
      </Time>

      <Number
        container={this.layout} ref={this.number} innerRef={React.createRef()}
        onClick={() => this.props.onEnsureCurrentOrder(this.props.service.service, this.props.service.position)
          .then(() => this.props.history.push(this.orderUrl()))
        }
        active={Boolean(this.props.service.current_order)}
      >
        {this.props.service.position}
      </Number>

      <Price container={this.layout} ref={this.price} innerRef={React.createRef()} >
        {this.props.service.current_order &&
          "$" + this.props.service.current_order.bill_amount(
            this.props.service.hourly_rate * this.props.room_pricing_factor,
            this.props.current_time,
          )
        }
      </Price>
    </Layout>
  )

  orderUrl() {
    return `/table/${this.props.service.service}/${this.props.service.position}/snacks`
  }
}

const Layout = styled.div`
  display: grid;

  grid-template-columns: 1fr auto 1fr;
  grid-column-gap: 0.5rem;
  align-items: center;
`

const Time = styled.span`
  color: ${grey};
  text-align: right;
`

const Number = styled.div`
  align-items: center;
  background-color: ${({active}) => active ? grey : blue};
  border: 1px solid white;
  color: white;
  display: grid;
  font-size: 2rem;
  height: 3rem;
  text-align: center;
  width: 3rem;
`

const Price = styled.span`
  color: ${grey};
  text-align: left;
`

export default withRouter(Table);
