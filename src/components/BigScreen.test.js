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

  xit("Displays snack information", () => {
    let component = mount(<BigScreen />)
  });

  xit("Displays drink information", () => {
    let component = mount(<BigScreen />)
  });

  xit("Displays service information", () => {
    let component = mount(<BigScreen />)
  });

  xit("Adjusts the prices of rooms depending on the discount", () => {
  })
})
