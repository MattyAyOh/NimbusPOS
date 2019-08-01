import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import Selection from "../principals/Selection"
import 'react-select/dist/react-select.css'

import Reservation from "./Reservation"
import { DateTime } from "luxon"

@observer
class Reservations extends React.Component {
  componentDidMount() {
    window.DateTime = DateTime
  }

  render() {
    return (
      <Layout>
        <Layout.Title>
          Reservations
        </Layout.Title>

        <Center>
          {this.props.assembly.data.reservation_date.todayButton}
          {this.props.assembly.data.reservation_date.calendar}
        </Center>

        <NewReservation>
          <h3>New Reservation</h3>

          <SaveButton
            onClick={() => this.props.assembly.create_reservation()}
          >
            Save
          </SaveButton>

          <Selection
            update={() => this.props.assembly.new_reservation.service}
            options={
              this.props.assembly.services
                .map(service => service.name)
                .unique()
            }
            onChange={(service) => this.props.assembly.new_reservation.set_service(service) }
          />

          <Selection
            update={() => this.props.assembly.new_reservation.position}
            options={
              this.props.assembly.services
                .filter(service => service.name === this.props.assembly.new_reservation.service)
                .map(service => service.position)
                .unique()
            }
            onChange={(position) => this.props.assembly.new_reservation.set_position(position) }
          />

          <ReservationTimes>
            {this.props.assembly.new_reservation.timespanInput(this.props.assembly)}
          </ReservationTimes>
        </NewReservation>

        {this.props.assembly.reservations
            .filter(reservation =>
              reservation.start_time > this.props.assembly.reservation_date.luxon.toUTC().plus({ hours: 4 }) &&
              reservation.start_time < this.props.assembly.reservation_date.luxon.toUTC().plus({ days: 1, hours: 4 })
            )
            .map((reservation) =>
              <Reservation
                key={reservation.id}
                {...reservation}
                assembly={this.props.assembly}
              />
        )}

        {(this.props.assembly.reservations.count === 0) &&
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
  border: 1px solid #444444;
  padding: 1rem;
  margin-bottom: 2rem;
  margin-right: 2rem;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto;
  grid-row-gap: 1rem;
`

const ReservationTimes = styled.div`
  grid-area: 3/1/3/3;
  text-align: center;
`

const SaveButton = styled.span`
  background-color: blue;
  color: white;
  display: inline-block;
  height: 1rem;
  margin-left: auto;
  padding: 0.5rem;
`

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
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
