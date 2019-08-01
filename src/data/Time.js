import { DateTime } from "luxon"
import { types } from "mobx-state-tree"

const Time = types.custom({
  name: "Time",

  fromSnapshot(value) { return new DateTime.fromISO(value + "Z") },
  toSnapshot(value) { return value.toISO() },
  isTargetType(value) { return value && value.isLuxonDateTime },

  getValidationMessage(value) {
    return (
      value && DateTime.fromISO(value).isLuxonDateTime
      ? ""
      : `'${value}' is not a Luxon DateTime.`
    )
  }

})

export default Time
