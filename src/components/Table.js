import React from "react"
import styled from "styled-components"
import moment from "moment"
import {Link, withRouter} from "react-router-dom"

import bill_amount from "../utils/bill_amount"

const blue = "#4a90e2"
const grey = "#afb5bd"

class Table extends React.Component {
  render() {
    return (
      <Layout>
        <Time>
          {this.props.current_order &&
            moment(this.props.current_order.start_time).format('LT')}
        </Time>

        {this.props.current_order
        ? <Number active>
            <Link to={this.orderUrl()} >
              {this.props.position}
            </Link>
          </Number>
        : <Number onClick={() => this.props.onEnsureCurrentOrder(this.props.service, this.props.position)
            .then(() => this.props.history.push(this.orderUrl()))
          } >
            {this.props.position}
          </Number>
        }

        <Price>
          {this.props.current_order &&
            "$" + bill_amount(this.props.current_order, this.props.hourly_rate, this.props.current_time)
          }
        </Price>
      </Layout>
    )
  }

  orderUrl() {
    return `/table/${this.props.service}/${this.props.position}/snacks`
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
