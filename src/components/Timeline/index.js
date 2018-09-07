import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { observable } from "mobx"

import moment from "moment"
import interactjs from "interactjs"

import "react-calendar-timeline/lib/Timeline.css"
import "./styles.css"

import ReactTimeline, {
  CustomMarker,
  CursorMarker,
  TimelineMarkers,
  TodayMarker,
} from "react-calendar-timeline"

const nimbusBlue = '#4a90e2'

const marker = (width, color) => ({ styles, date }) =>
  <div style={{
    ...styles,
    backgroundColor: color,
    width: width,
  }} />

@observer
class Timeline extends React.Component {
  componentWillMount() {
    let now = moment()
    this.opening_time = moment().hour(this.props.businessHoursOpen).minute(0).second(0)
    this.closing_time = moment().hour(this.props.businessHoursClose).minute(0).second(0)

    if(this.closing_time < now)
      this.closing_time.add(1, 'day')

    if(this.opening_time > now)
      this.opening_time.subtract(1, 'day')
  }

  render = () => (
    <ReactTimeline
       groups={this.props.reservables}
       items={this.props.reservations}
       defaultTimeStart={moment().add(-3, 'hour')}
       defaultTimeEnd={moment().add(6, 'hour')}
       timeSteps={{
         second: 1,
         minute: 15,
         hour: 1,
         day: 1,
         month: 1,
         year: 1
       }}
       verticalLineClassNamesForTime={this.verticalLineClassNamesForTime}
     >
       <TimelineMarkers>
         <TodayMarker/>

         <CustomMarker date={this.opening_time} >
           {marker('4px', nimbusBlue)}
         </CustomMarker>

         <CustomMarker date={this.closing_time} >
           {marker('4px', nimbusBlue)}
         </CustomMarker>

         <CursorMarker>
           {marker('1px', 'grey')}
         </CursorMarker>
       </TimelineMarkers>
     </ReactTimeline>
  )

  verticalLineClassNamesForTime = (timeStart, timeEnd) => {
    const currentTimeStart = moment(timeStart).add(1, 'second')
    const currentTimeEnd = moment(timeEnd)

    return (
      this.opening_time <= currentTimeStart && currentTimeEnd <= this.closing_time
      ? ['open']
      : []
    )
  }
}

export default Timeline
