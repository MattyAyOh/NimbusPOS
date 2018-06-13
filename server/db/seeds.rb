# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

# First, remove old data
OrderExtra.destroy_all
Order.destroy_all
Extra.destroy_all
Service.destroy_all

# List out the available services
Service.create!(name: "Mahjong", position: 1, service_type: "mahjong", hourly_rate: 20.00)
Service.create!(name: "Mahjong", position: 2, service_type: "mahjong", hourly_rate: 20.00)
Service.create!(name: "Mahjong", position: 3, service_type: "mahjong", hourly_rate: 20.00)
Service.create!(name: "Mahjong", position: 4, service_type: "mahjong", hourly_rate: 20.00)
Service.create!(name: "Mahjong", position: 5, service_type: "mahjong", hourly_rate: 20.00)
Service.create!(name: "Mahjong", position: 6, service_type: "mahjong", hourly_rate: 20.00)
Service.create!(name: "Mahjong", position: 7, service_type: "mahjong", hourly_rate: 20.00)
Service.create!(name: "Mahjong", position: 8, service_type: "mahjong", hourly_rate: 20.00)

Service.create!(name: "Pool", position: 1, service_type: "pool", hourly_rate: 30.00)
Service.create!(name: "Pool", position: 2, service_type: "pool", hourly_rate: 30.00)
Service.create!(name: "Pool", position: 3, service_type: "pool", hourly_rate: 30.00)
Service.create!(name: "Pool", position: 4, service_type: "pool", hourly_rate: 30.00)

Service.create!(name: "KTV", position: 1, service_type: "ktv", hourly_rate: 10.00)
Service.create!(name: "KTV", position: 2, service_type: "ktv", hourly_rate: 10.00)
Service.create!(name: "KTV", position: 3, service_type: "ktv", hourly_rate: 10.00)
Service.create!(name: "KTV", position: 4, service_type: "ktv", hourly_rate: 10.00)

# List out the available "extras"
Extra.create!(name: "Instant Ramen", extra_type: "snack", price: 5.00)
Extra.create!(name: "Fish Tofu", extra_type: "snack", price: 4.00)
Extra.create!(name: "Lonely God", extra_type: "snack", price: 4.00)
Extra.create!(name: "Shrimp Flakes", extra_type: "snack", price: 4.00)
Extra.create!(name: "Beancurd", extra_type: "snack", price: 4.00)
Extra.create!(name: "Pocky", extra_type: "snack", price: 4.00)
Extra.create!(name: "GGE", extra_type: "snack", price: 3.00)
Extra.create!(name: "Yan Yan", extra_type: "snack", price: 2.00)
Extra.create!(name: "Tiramisu", extra_type: "snack", price: 1.00)
Extra.create!(name: "Choco Pie", extra_type: "snack", price: 1.00)
Extra.create!(name: "Cookie", extra_type: "snack", price: 1.00)

Extra.create!(name: "Calpico", extra_type: "drink", price: 4.00)
Extra.create!(name: "Milk Drink", extra_type: "drink", price: 3.00)
Extra.create!(name: "Coconut Milk", extra_type: "drink", price: 3.00)
Extra.create!(name: "Lemon Ice Box", extra_type: "drink", price: 3.00)
Extra.create!(name: "Green Tea Bottle", extra_type: "drink", price: 3.00)
Extra.create!(name: "Pear Juice", extra_type: "drink", price: 3.00)
Extra.create!(name: "Fanta", extra_type: "drink", price: 3.00)
Extra.create!(name: "Sprite", extra_type: "drink", price: 3.00)
Extra.create!(name: "Coke", extra_type: "drink", price: 3.00)
Extra.create!(name: "Diet Coke", extra_type: "drink", price: 2.00)
Extra.create!(name: "Milki", extra_type: "drink", price: 2.00)
Extra.create!(name: "Lemon Box", extra_type: "drink", price: 2.00)
Extra.create!(name: "Bottled Water", extra_type: "drink", price: 1.00)
Extra.create!(name: "Hot Tea", extra_type: "drink", price: 1.00)

# Other fees
Extra.create!(name: "Playing Cards", extra_type: "other", price: 5.00)
Extra.create!(name: "Stickiness", extra_type: "other", price: 25.00)
Extra.create!(name: "Puke", extra_type: "other", price: 50.00)
Extra.create!(name: "Burns", extra_type: "other", price: 50.00)

# Create an example order
Service.first.orders.create!(start_time: 1.hour.ago)