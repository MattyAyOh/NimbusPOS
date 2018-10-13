import React from "react";
import BigScreen from "./BigScreen";
import { mount } from "enzyme"
import URI from "urijs"

describe("<BigScreen/>", () => {
  it("displays a YouTube video on repeat", () => {
    let component = mount(<BigScreen
      extras={[]}
      services={[]}
      room_pricing_factor={1}
    />)

    let video = component.find("iframe")
    let videoURL = new URI(video.prop("src"))
    let pathParts = videoURL.path().split("/")
    let video_id = pathParts[pathParts.length-1]
    let playlist_id = videoURL.search(true).playlist

    expect(video_id).toEqual(playlist_id)
    expect(video.prop("alt")).toBeDefined()
  })

  it("Displays snack pricing", () => {
    let component = mount(<BigScreen
      extras={[
        {
          image_url: "https://jpg.cool/instant.ramen",
          name: "Instant Ramen",
          price: 5,
          extra_type: "snack",
        }
      ]}
      services={[]}
      room_pricing_factor={1}
    />)

    let price = component
      .find(BigScreen.Extra)
      .find(BigScreen.Price)
      .filterWhere(e => e.text() !== "")
      .text()

    expect(price).toBe("5")
  });

  it("Displays drink pricing", () => {
    let component = mount(<BigScreen
      extras={[
        {
          image_url: "https://jpg.cool/water",
          name: "Water",
          price: 1,
          extra_type: "drink",
        }
      ]}
      services={[]}
      room_pricing_factor={1}
    />)

    let price = component
      .find(BigScreen.Extra)
      .find(BigScreen.Price)
      .filterWhere(e => e.text() !== "")
      .text()

    expect(price).toBe("1")
  });

  it("Displays service pricing", () => {
    let component = mount(<BigScreen
      extras={[]}
      services={[
        {
          current_order: null,
          hourly_rate: 20,
          name: "Mahjong",
          position: 1,
          service: "mahjong",
        }
      ]}
      room_pricing_factor={1}
    />)


    let price = component
      .find(BigScreen.Price)
      .filterWhere(e => e.text() !== "")
      .text()

    expect(price).toBe("20")
  });

  xit("Adjusts the prices of rooms depending on the discount", () => {
    let component = mount(<BigScreen
      extras={[]}
      services={[
        {
          current_order: null,
          hourly_rate: 20,
          name: "Mahjong",
          position: 1,
          service: "mahjong",
        }
      ]}
      room_pricing_factor={0.5}
    />)

    let price = component
      .find(BigScreen.Price)
      .filterWhere(e => e.text() !== "")
      .text()

    expect(price).toBe("10")
  })
})
