import { observable, computed, action, autorun, runInAction } from 'mobx';
import moment from "moment"
import Assemble from "./Assemble"

import Service from "./data/Service"
import LineItem from "./data/LineItem"
import Extra from "./data/Extra"

class View {
  @observable name = null
  @observable tab = null
  @observable order = null

  constructor(values) {
    this.name = values.name
    this.tab = values.tab
    this.order = values.order
  }
}

class Store {
  assemble = null;
  @observable currentUser = null;
  @observable currentView = null;

  // TODO normalize data models with UUIDs
  @observable loaded = false
  @observable reservations = []
  @observable services = []
  @observable extras = []

  constructor(assemble) {
    this.assemble = assemble || new Assemble("https://localhost:3000")

    this.assemble.watch("nimbus")`
    {
      services: Service.order(:service_type, :position),
      extras: Extra.all,
    }
    `(result => runInAction(() => {
      this.loaded = true
      this.services = result.services.map(this.parseService)
      this.extras = result.extras.map(this.parseExtra)
    }));

    autorun(this.ensureEndTime.bind(this))
    autorun(this.persistOrder.bind(this))
  }

  addReservation(data) {
    this.reservations.push(data)
  }

  lineItemForExtra(extra) {
    let lineItem = this.currentView.order.line_items.filter((x) =>
      x.name === extra.name
    )[0]

    if(!Boolean(lineItem)) {
      lineItem = new LineItem({ extra: extra, quantity: 0 })
      runInAction(() => this.currentView.order.line_items.push(lineItem))
    }

    return lineItem
  }

  @action
  incrementExtraQuantity(extra, amount) {
    const lineItem = this.lineItemForExtra(extra)
    lineItem.quantity = lineItem.quantity + amount

    this.persistExtra({ quantity: lineItem.quantity }, extra.name)
  }

  parseService(json) {
    return new Service(json)
  }

  parseExtra(json) {
    return new Extra(json)
  }

  ensureEndTime() {
    if(this.currentView
      && this.currentView.name === "order"
      && this.currentView.tab === "checkout"
      && this.currentView.order.end_time === null)
      this.currentView.order.end_time = moment()
  }

  @computed get start_time() {
    if(this.currentView.order) {
      return this.currentView.order.start_time &&
        moment(this.currentView.order.start_time)
    }
  }

  @computed get end_time() {
    if(this.currentView.order) {
      return this.currentView.order.end_time &&
        moment(this.currentView.order.end_time)
    }
  }

  @action showOrder(order) {
    this.currentView = new View({
      name: "order",
      order: order,
      tab: "snacks",
    })
  }

  @action showTab(tabName) {
    this.currentView.tab = tabName
  }

  @action showReservations() {
    this.currentView = new View({
      name: "reservations"
    })
  }

  @action showLobby() {
    this.currentView = null
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
    if(!Boolean(this.currentView && this.currentView.order))
      return;

    let state = {
      start_time: this.start_time && this.start_time.format(),
      end_time: this.end_time && this.end_time.format(),
      cash_handled: this.currentView.order.cash_handled,
    }

    return this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(this.currentView.order.service.service)},
        position: ${JSON.stringify(this.currentView.order.service.position)},
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
    if(!Boolean(this.currentView.order))
      return

    this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(this.currentView.order.service.service)},
        position: ${JSON.stringify(this.currentView.order.service.position)},
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

    this.currentView.order[field] = new_time
  }
}

export default Store;
