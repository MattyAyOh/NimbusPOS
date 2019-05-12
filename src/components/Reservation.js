import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"

@observer
class Reservation extends React.Component {
  layout = React.createRef()
  service = React.createRef()
  times = React.createRef()

  render = () => (
    <Layout container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      <p container={this.layout} ref={this.service} innerRef={React.createRef()} >
        { this.props.service_name } { this.props.service_position }
      </p>

      <p container={this.layout} ref={this.times} innerRef={React.createRef()} >
        { DateTime.fromISO(this.props.start_time).toLocaleString(DateTime.DATE_TIME) }
        &nbsp; to &nbsp;
        { DateTime.fromISO(this.props.end_time).toLocaleString(DateTime.DATE_TIME) }
      </p>
    </Layout>
  )
}

const Layout = styled.div`
  margin-bottom: 2rem;
`

export default Reservation
