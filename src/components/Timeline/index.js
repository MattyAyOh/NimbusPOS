import React from "react"
import { observer } from "mobx-react"
import moment from "moment"

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
      // Data from parent.
      groups={this.props.reservables}
      items={this.props.reservations}

      // Focus the timeline on today's business hours.
      defaultTimeStart={moment(this.opening_time).subtract(1, 'hour')}
      defaultTimeEnd={moment(this.closing_time).add(1, 'hour')}

      // Used to highlight business hours.
      verticalLineClassNamesForTime={this.verticalLineClassNamesForTime}

      // Row height in `px`.
      lineHeight={40}

      // Dragging an element will not change its row.
      canChangeGroup={false}

      useResizeHandle

      // The mouse scroll wheel will zoom.
      traditionalZoom

      // By default, the calendar uses 15-minute time intervals.
      // Uncomment to change the interval.
      // dragSnap={5*60*1000}

      // Event handlers, passed in from parent
      onCanvasClick={this.props.onCanvasClick}
      onItemClick={this.props.onItemClick}
      onItemMove={this.props.onItemMove}
      onItemResize={this.props.onItemResize}
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
