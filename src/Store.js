import { observable, computed, action, autorun, runInAction } from 'mobx';
import moment from "moment"

import LineItem from "./data/LineItem"
import Service from "./data/Service"

class Store {
  assemble = null;
  @observable currentUser = null;
  @observable currentView = observable.map();

  @observable loaded = false
  @observable visor = false
  @observable dataModels = []

  constructor(assemble, models) {
    this.assemble = assemble
    this.dataModels = models

    models.forEach(model => {
      let modelList = model.name.toLowerCase() + 's'
      let store = this

      store[modelList] = observable([])

      store[`add${model.name}`] = data => runInAction(() =>
        store[modelList].push(new model(data))
      )
    })

    this.assemble.watch("nimbus")`
    {
      services: Service.order(:service_type, :position),
      extras: Extra.all,
      orders: Order.all,
    }
    `(result => {
      // TODO when UUID indexing exists, we should not need to clear the array.
      this.services = []
      result.services.map(this.addService)

      // TODO when UUID indexing exists, we should not need to clear the array.
      this.extras = []
      result.extras.map(this.addExtra)

      // TODO when UUID indexing exists, we should not need to clear the array.
      this.orders = []
      result.orders.map(this.addOrder)

      runInAction(() => this.loaded = true)
    });

    autorun(this.ensureEndTime.bind(this))
    autorun(this.persistOrder.bind(this))
  }

  lineItemForExtra(extra) {
    let lineItem = this.order.line_items.filter((x) =>
      x.name === extra.name
    )[0]

    if(!Boolean(lineItem)) {
      lineItem = new LineItem({ extra: extra, quantity: 0 })
      runInAction(() => this.order.line_items.push(lineItem))
    }

    return lineItem
  }

  @action
  toggleVisor() {
    this.visor
    ? this.visor = null
    : this.visor = true
  }

  @action
  incrementExtraQuantity(extra, amount) {
    const lineItem = this.lineItemForExtra(extra)
    lineItem.quantity = lineItem.quantity + amount

    this.persistExtra({ quantity: lineItem.quantity }, extra.name)
  }

  ensureEndTime() {
    if(this.currentView
      && this.currentView.get("name") === "order"
      && this.currentView.get("tab") === "checkout"
      && this.order.end_time === null)
      this.order.end_time = moment()
  }

  @computed get order() {
    return this.currentView.get("order")
  }

  @computed get start_time() {
    if(this.order) {
      return this.order.start_time &&
        moment(this.order.start_time)
    }
  }

  @computed get end_time() {
    if(this.order) {
      return this.order.end_time &&
        moment(this.order.end_time)
    }
  }

  @action showOrder(order) {
    this.currentView = observable.map({
      name: "order",
      order: order,
      tab: "snacks",
    })
  }

  @action showTab(tabName) {
    this.currentView.set("tab", tabName)
  }

  @action showReservations() {
    this.currentView = observable.map({
      name: "reservations"
    })
  }

  @action showLobby() {
    this.currentView = observable.map()
  }

  ensureCurrentOrder(service) {
    this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(service.service)},
        position: ${JSON.stringify(service.position)},
      )

      service.current_order || service.orders.create!(start_time: Time.current)
      service
    `.then((data) =>  this.showOrder(new Service(data).current_order))
  }

  cancelOrder(service) {
    this.assemble.run("nimbus")`
      Service.find_by(
        service_type: ${JSON.stringify(service.service)},
        position: ${JSON.stringify(service.position)}
      ).current_order.destroy!
    `.then(() => this.showLobby())
  }

  persistOrder() {
    if(!Boolean(this.order))
      return;

    let state = {
      start_time: this.start_time && this.start_time.format(),
      end_time: this.end_time && this.end_time.format(),
      cash_handled: this.order.cash_handled,
    }

    return this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(this.order.service.service)},
        position: ${JSON.stringify(this.order.service.position)},
      )

      order = service.current_order || Order.create!(service: service)
      result = order.update!(JSON.parse('${JSON.stringify(state)}'))

      { persisted: result, closed: !order.open? }
    `.then((result) => {
      if(result.closed) this.showLobby()
    })
  }

  persistExtra(state, extra_name) {
    // We can only update an extra quantity if the order is on the page.
    if(!Boolean(this.order))
      return

    this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(this.order.service.service)},
        position: ${JSON.stringify(this.order.service.position)},
      )

      order = service.current_order || Order.create!(service: service)
      extra = Extra.find_by(name: ${JSON.stringify(extra_name)})

      order_extra =
        OrderExtra.find_by(order: order, extra: extra) ||
        OrderExtra.create!(order: order, extra: extra)

      if(${JSON.stringify(state.quantity)}.to_i > 0)
        result = order_extra.update!(
          quantity: ${JSON.stringify(state.quantity)},
        )
      else
        order_extra.destroy!
      end
    `
  }

  // `field`: `"start_time"` or `"end_time"`
  // `new_time`: a `moment` object
  @action
  timeUpdated(field, new_time) {
    const current_hour = moment().get("hour")
    const chosen_hour = new_time.get("hour")

    // Chose a time before this past midnight?
    if(current_hour < 12 && chosen_hour > 12)
      new_time.subtract(1, "day")

    // Chose a time after this coming midnight?
    if(current_hour > 12 && chosen_hour < 12)
      new_time.add(1, "day")

    this.order[field] = new_time
  }
}

export default Store;
