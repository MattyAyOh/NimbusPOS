import React from "react";
import { mount } from "enzyme"

import Checkout from "../components/Checkout"

describe("Checkout", () => {
  xit("disables the 'Confirm' button until 'Cash Handled' is filled in", () => {
    const checkout = mount(<Checkout {...default_props} />);

    expect(checkout.state().cash_handled).to.equal(null)
    expect(checkout.find("button").getDOMNode().attributes).to.have.property("disabled")

    checkout.find("input").simulate("change", { target: { value: 10 }})

    expect(checkout.state().cash_handled).to.equal(10)
    expect(checkout.find("button").getDOMNode().attributes).not.to.have.property("disabled")

    checkout.find("input").simulate("change", { target: { value: "" }})

    expect(checkout.state().cash_handled).to.equal(null)
    expect(checkout.find("button").getDOMNode().attributes).to.have.property("disabled")
  });
});

const default_props = {
  onMount: () => {},
  order: {
    extras: [],
    cash_handled: null,
    end_time: "2018-02-24T21:00:00.000Z",
    start_time: "2018-02-24T20:00:00.000Z",
  },
  service: {
    hourly_rate: 20,
    name: "Mahjong",
    position: 1,
    service: "mahjong",
  },
  extras: [],
}
