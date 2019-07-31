import Extra from "./Extra"
import { types } from "mobx-state-tree"

const OrderExtra = types.model({
  id: types.integer,
  extra_id: types.integer,
  quantity: types.maybeNull(types.integer),
  extra: Extra,
})

export default OrderExtra
