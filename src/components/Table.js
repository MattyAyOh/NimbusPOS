import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"

const blue = "#4a90e2"
const grey = "#afb5bd"

@observer
class Table extends React.Component {
  render() {
    return (
      <Layout>
        <Time>
          { this.props.service.current_order &&
            DateTime
            .fromISO(this.props.service.current_order.start_time)
            .toLocaleString(DateTime.TIME_24_SIMPLE)
          }
        </Time>

        <Number
          onClick={() => this.props.assembly.ensureCurrentOrder(this.props.service.service, this.props.service.position) }
          active={Boolean(this.props.service.current_order)}
        >
          {this.props.service.position}
        </Number>

        <Price>
          {this.props.service.current_order &&
            "$" + this.props.service.current_order.bill_amount(
              this.props.service.hourly_rate * this.props.assembly.room_pricing_factor,
              this.props.current_time,
            )
          }
        </Price>
      </Layout>
    )
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

export default Table
