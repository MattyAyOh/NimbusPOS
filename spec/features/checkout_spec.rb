require "active_support/core_ext/numeric/time"
require "selenium-webdriver"

describe "Checkout flow" do
  before do
    caps = Selenium::WebDriver::Remote::Capabilities.send("chrome")
    @driver = Selenium::WebDriver.for(:remote, url: "http://0.0.0.0:4444/wd/hub", desired_capabilities: caps)
    @driver.manage.window.size = Selenium::WebDriver::Dimension.new(1920, 1080)
  end

  after do
    @driver.quit
  end

  it "closes out the order when complete" do
    service = create(:service, hourly_rate: 20)
    extra = create(:snack, price: 5, name: "Instant Ramen")
    order = create(
      :order,
      service: service,
      start_time: 1.hour.ago,
      end_time: Time.current,
      extras: [extra],
    )

    visit "http://localhost:3001"

    click_on(".table.active")
    within(".instant-ramen") { click_on("+") }
    click_on "Checkout"

    expect("Total").to == 25
  end

  it "takes into account the room discount" do
    service = create(:service, hourly_rate: 20)
    extra = create(:snack, price: 5, name: "Instant Ramen")
    order = create(
      :order,
      service: service,
      start_time: 1.hour.ago,
      end_time: Time.current,
      extras: [extra],
    )
    create(:room_pricing_event, pricing_factor: 0.5)

    visit "http://localhost:3001"

    click_on(".table.active")
    within(".instant-ramen") { click_on("+") }
    click_on "Checkout"

    expect("Total").to == 15
  end
end
