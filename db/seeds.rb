# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

# First, remove old data
OrderExtra.destroy_all
Sale.destroy_all
Order.destroy_all
Extra.destroy_all
Service.destroy_all

# List out the available services
Service.create!(name: "Mahjong 1", hourly_rate: 0.0, service_type: "mahjong")
Service.create!(name: "Mahjong 2", hourly_rate: 0.0, service_type: "mahjong")
Service.create!(name: "Mahjong 3", hourly_rate: 0.0, service_type: "mahjong")
Service.create!(name: "Mahjong 4", hourly_rate: 0.0, service_type: "mahjong")
Service.create!(name: "Mahjong 5", hourly_rate: 0.0, service_type: "mahjong")
Service.create!(name: "Mahjong 6", hourly_rate: 0.0, service_type: "mahjong")
Service.create!(name: "Mahjong 7", hourly_rate: 0.0, service_type: "mahjong")
Service.create!(name: "Mahjong 8", hourly_rate: 0.0, service_type: "mahjong")

Service.create!(name: "Pool 1", hourly_rate: 0.0, service_type: "ktv")
Service.create!(name: "Pool 2", hourly_rate: 0.0, service_type: "ktv")
Service.create!(name: "Pool 3", hourly_rate: 0.0, service_type: "ktv")
Service.create!(name: "Pool 4", hourly_rate: 0.0, service_type: "ktv")

Service.create!(name: "KTV 1", hourly_rate: 0.0, service_type: "pool")
Service.create!(name: "KTV 2", hourly_rate: 0.0, service_type: "pool")
Service.create!(name: "KTV 3", hourly_rate: 0.0, service_type: "pool")
Service.create!(name: "KTV 4", hourly_rate: 0.0, service_type: "pool")

# List out the available "extras"
Extra.create!(name: "Instant Ramen", extra_type: "snack", price: 0.0)
Extra.create!(name: "Fish Tofu", extra_type: "snack", price: 0.0)
Extra.create!(name: "Lonely God", extra_type: "snack", price: 0.0)
Extra.create!(name: "Shrimp Flakes", extra_type: "snack", price: 0.0)
Extra.create!(name: "Beancurd", extra_type: "snack", price: 0.0)
Extra.create!(name: "Pocky", extra_type: "snack", price: 0.0)
Extra.create!(name: "GGE", extra_type: "snack", price: 0.0)
Extra.create!(name: "Yan Yan", extra_type: "snack", price: 0.0)
Extra.create!(name: "Tiramisu", extra_type: "snack", price: 0.0)
Extra.create!(name: "Choco Pie", extra_type: "snack", price: 0.0)
Extra.create!(name: "Cookie", extra_type: "snack", price: 0.0)

Extra.create!(name: "Calpico", extra_type: "drink", price: 0.0)
Extra.create!(name: "Milk Drink", extra_type: "drink", price: 0.0)
Extra.create!(name: "Coconut Milk", extra_type: "drink", price: 0.0)
Extra.create!(name: "Lemon Ice Box", extra_type: "drink", price: 0.0)
Extra.create!(name: "Green Tea Bottle", extra_type: "drink", price: 0.0)
Extra.create!(name: "Pear Juice", extra_type: "drink", price: 0.0)
Extra.create!(name: "Fanta", extra_type: "drink", price: 0.0)
Extra.create!(name: "Sprite", extra_type: "drink", price: 0.0)
Extra.create!(name: "Coke", extra_type: "drink", price: 0.0)
Extra.create!(name: "Diet Coke", extra_type: "drink", price: 0.0)
Extra.create!(name: "Milki", extra_type: "drink", price: 0.0)
Extra.create!(name: "Lemon Box", extra_type: "drink", price: 0.0)
Extra.create!(name: "Bottled Water", extra_type: "drink", price: 0.0)
Extra.create!(name: "Hot Tea", extra_type: "drink", price: 0.0)
