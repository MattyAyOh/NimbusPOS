import { types } from "mobx-state-tree"

const Extra = types.model({
  name: types.string,
  price: types.integer,
  id: types.maybe(types.integer),
  image_url: types.maybeNull(types.string),
  extra_type: types.maybe(types.integer),
})

export default Extra
