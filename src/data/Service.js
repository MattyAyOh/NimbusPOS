import { types } from "mobx-state-tree"

const Service = types.model({
  id: types.maybe(types.integer),
  hourly_rate: types.maybe(types.integer),
  service_type: types.maybe(types.integer),
  name: types.string,
  position: types.integer,
})

export default Service
