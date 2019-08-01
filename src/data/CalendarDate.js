import React from "react"
import Calendar from "react-calendar"
import { types } from "mobx-state-tree"
import { DateTime } from "luxon"
import Button from "../principals/Button"

const CalendarDate = types.model({
  iso: types.maybe(types.string),
})
  .views(self => ({
    get luxon() {
      return self.iso
        ? DateTime.fromISO(self.iso)
        : DateTime.local.startOf("day")
    },

    get calendar() {
      return <Calendar
        onChange={value => self.set(value)}
        value={new Date(self.luxon.ts)}
      />
    },

    get todayButton() {
      return (
        <Button
          onClick={() => self.setLuxon(DateTime.local().startOf("day"))}
        >
          Today
        </Button>
      )
    }
  }))
  .actions(self => ({
    set(date) {
      self.setLuxon(DateTime.fromJSDate(date))
    },

    setLuxon(date) {
      self.iso = date.toISO()
    },
  }))

export default CalendarDate
