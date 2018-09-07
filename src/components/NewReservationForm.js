import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { observable } from "mobx"

import TimeSpanInput from "./TimeSpanInput"

@observer
class NewReservationForm extends React.Component {
  @observable start_time;
  @observable end_time;
  @observable name;
  @observable phone;

  render = () => (
    <NewReservation>
      <TimeSpanInput
        startTime={this.start_time}
        end_time={this.end_time}
        onStartTimeChange={(new_time) => this.start_time = new_time }
        onEndTimeChange={(new_time) => this.end_time = new_time }
      />

      <Button onClick={() => this.props.assemble.run("nimbus")`
        Reservation.create!(
          start_time: ${JSON.stringify(this.start_time.format())},
          end_time: ${JSON.stringify(this.end_time.format())},
          service: Service.find_by(
            name: ${JSON.stringify(this.service)},
            position: ${JSON.stringify(this.position)},
          )
        )
      `}>
        Add reservation
      </Button>
    </NewReservation>
  )
}

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

export default NewReservationForm
