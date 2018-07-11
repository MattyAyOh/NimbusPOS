import { observable, computed, action } from 'mobx';

class Store {
  @observable currentUser = null;
  @observable currentView = null;

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
}

export default Store;
