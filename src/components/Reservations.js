import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import Select from "react-select"
import 'react-select/dist/react-select.css';

import Component from "../principals/Component"
import Reservation from "./Reservation"
import TimeSpanInput from "./TimeSpanInput"

@observer
class Reservations extends React.Component {
  layout = React.createRef()
  title = React.createRef()
  new_reservation = React.createRef()
  select_service = React.createRef()
  select_position = React.createRef()
  time_span = React.createRef()
  create = React.createRef()
  no_reservation = React.createRef()

  render = () => (
    <Layout container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      <Layout.Title container={this.layout} ref={this.title} innerRef={React.createRef()} >
        Reservations
      </Layout.Title>

      <Component
        assembly={this.props.assembly}
        uuid="15922bc0-7ddb-4878-afb2-e63775aaf7ef"
        container={this.layout} ref={this.new_reservation} innerRef={React.createRef()} >
        <Select
          container={this.new_reservation} ref={this.select_service} innerRef={React.createRef()}
          value={this.props.assembly.new_reservation.service}
          options={
            this.props.services
              .map(service => service.name)
              .unique()
              .map(service => ({ label: service, value: service }))
          }
          onChange={(service) => this.props.assembly.new_reservation.service = service.value }
        />

        <Select
          container={this.new_reservation} ref={this.select_position} innerRef={React.createRef()}
          value={this.props.assembly.new_reservation.position}
          options={
            this.props.services
              .map((service) => ({ label: service.position, value: service.position }))
          }
          onChange={(position) => this.props.assembly.new_reservation.position = position.value }
        />

        <TimeSpanInput
          container={this.new_reservation} ref={this.time_span} innerRef={React.createRef()}
          startTime={this.props.assembly.new_reservation.start_time}
          end_time={this.props.assembly.new_reservation.end_time}
          onStartTimeChange={(new_time) => this.props.assembly.new_reservation.start_time = new_time }
          onEndTimeChange={(new_time) => this.props.assembly.new_reservation.end_time = new_time }
        />

        <Button
          container={this.new_reservation} ref={this.create} innerRef={React.createRef()}
          onClick={() => this.props.assembly.createReservation()}
        >
          Add reservation
        </Button>
      </Component>

      {this.props.reservations.map((reservation) =>
        <Reservation
          key={reservation.id}
          assembly={this.props.assembly}
          {...reservation}
        />
      )}

      {(this.props.reservations.count === 0) &&
        <div container={this.layout} ref={this.no_reservation} innerRef={React.createRef()} >
          No reservations
        </div>
      }
    </Layout>
  )
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
