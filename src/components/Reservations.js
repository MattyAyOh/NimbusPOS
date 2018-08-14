import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Reservation from "./Reservation"
import TimeSpanInput from "./TimeSpanInput"

@observer
class Reservations extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new_reservation: {},
    }
  }

  render() {
    return (
      <Layout>
        <Layout.Title>Reservations</Layout.Title>

        <NewReservation>
          <Select
            value={this.state.new_reservation.service}
            options={this.props.services.map(service => service.name).unique().map(service => ({ label: service, value: service }))}
            onChange={(service) => this.setState({ new_reservation: Object.assign(this.state.new_reservation, { service: service.value }) })}
          />

          <Select
            value={this.state.new_reservation.position}
            options={this.props.services.map((service) => ({ label: service.position, value: service.position }))}
            onChange={(position) => this.setState({ new_reservation: Object.assign(this.state.new_reservation, { position: position.value }) })}
          />

          <TimeSpanInput
            startTime={this.state.new_reservation.start_time}
            end_time={this.state.new_reservation.end_time}
            onStartTimeChange={(new_time) => this.setState({ new_reservation: Object.assign(this.state.new_reservation, { start_time: new_time }) })}
            onEndTimeChange={(new_time) => this.setState({ new_reservation: Object.assign(this.state.new_reservation, { end_time: new_time }) })}
          />

          <Button onClick={() => this.props.assemble.run("nimbus")`
            Reservation.create!(
              start_time: ${JSON.stringify(this.state.new_reservation.start_time.format())},
              end_time: ${JSON.stringify(this.state.new_reservation.end_time.format())},
              service: Service.find_by(
                name: ${JSON.stringify(this.state.new_reservation.service)},
                position: ${JSON.stringify(this.state.new_reservation.position)},
              )
            )
          `}>
            Add reservation
          </Button>
        </NewReservation>

        {this.props.reservations.map((reservation) =>
          <Reservation key={reservation.id} {...reservation}/>
        )}

        {(this.props.reservations.count === 0) &&
          <div>No reservations</div>}
      </Layout>
    )
  }
}

const Layout = styled.div`
`

Layout.Title = styled.h1`
  text-align: center;
`

const NewReservation = styled.div`
  background-color: #aaa;
  padding: 1rem;
  margin-bottom: 2rem;
  margin-right: 2rem;
`

const Button = styled.div`
  background-color: blue;
  color: white;
  display: inline-block;
  margin: 0.5rem;
  padding: 0.5rem;
`

Array.prototype.unique = function() {
  var unique = [];
  for (var i = 0; i < this.length; i++) {
    if (unique.indexOf(this[i]) === -1) {
      unique.push(this[i]);
    }
  }
  return unique;
};

export default Reservations
