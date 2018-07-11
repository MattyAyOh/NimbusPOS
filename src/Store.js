import { observable, computed, action, autorun } from 'mobx';
import moment from "moment"
import Assemble from "./Assemble"
import Service from "./data/Service"

// TODO normalize data models with UUIDs

class Store {
  assemble = null;
  @observable currentUser = null;
  @observable currentView = null;

  constructor(assemble) {
    this.assemble = assemble || new Assemble("https://localhost:3000")

    autorun(this.ensureEndTime.bind(this))
  }

  ensureEndTime() {
    if(this.currentView
      && this.currentView.name === "order"
      && this.currentView.tab === "checkout"
      && this.currentView.order.end_time === null)
      this.persistOrder({ end_time: moment() })
  }

  @computed get isAuthenticated() {
    return this.currentUser !== null
  }

  @action showOrder(order) {
    this.currentView = {
      name: "order",
      order,
      tab: "snacks",
    }
  }

  @action showTab(tabName) {
    this.currentView.tab = tabName
  }

  @action showReservations() {
    this.currentView = {
      name: "reservations"
    }
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

  // takes a `state` object, with:
  // `start_time`: `null` | `moment` object
  // `end_time`: `null` | `moment` object
  persistOrder(state, order) {
    if(state.start_time) state.start_time = state.start_time.format()
    if(state.end_time) state.end_time = state.end_time.format()

    return this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(order.service.service)},
        position: ${JSON.stringify(order.service.position)},
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
}

export default Store;
