import { types } from "mobx-state-tree"

const Extra = types.model({
  name: types.string,
  price: types.integer,
})

export default Extra
