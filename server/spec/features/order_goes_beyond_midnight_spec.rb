require 'rails_helper'

describe "order goes beyond midnight" do
  it "calculates correct amount of hours" do
    service = Service.create(name: "Mahjong1", hourly_rate: 30, service_type: "mahjong")
    visit "/"

    click_on "Mahjong1"

    fill_in "order[start_time]", with: "10:00PM"
    fill_in "order[end_time]", with: "01:00AM"
    click_on "Create Order"

    expect(page).to have_content("3.0 hrs")
    expect(page).to have_content("Total Service Cost: $90.00")
  end
end