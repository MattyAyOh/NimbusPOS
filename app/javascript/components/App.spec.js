import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import React from "react";

import App from "../components/App"

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  it("allows the user to start an order", () => {
    const app = Enzyme.mount(<App />);

    app.find("input").simulate("change", { target: { value: 10 }})

    expect(app.find("button").getDOMNode().attributes).to.have.property("disabled")
  });
});
