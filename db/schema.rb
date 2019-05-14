# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190514000013) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "extras", force: :cascade do |t|
    t.string "name"
    t.integer "price"
    t.integer "extra_type", default: 0
    t.string "image_url"
    t.boolean "active", default: true
  end

  create_table "order_extras", force: :cascade do |t|
    t.bigint "order_id"
    t.bigint "extra_id"
    t.integer "quantity"
    t.index ["extra_id"], name: "index_order_extras_on_extra_id"
    t.index ["order_id"], name: "index_order_extras_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "service_id"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "closed_at"
    t.index ["service_id"], name: "index_orders_on_service_id"
  end

  create_table "reservations", force: :cascade do |t|
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.bigint "service_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["service_id"], name: "index_reservations_on_service_id"
  end

  create_table "room_pricing_events", force: :cascade do |t|
    t.float "pricing_factor"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "services", force: :cascade do |t|
    t.string "name"
    t.integer "hourly_rate"
    t.integer "position"
    t.integer "service_type", default: 0
  end

  add_foreign_key "order_extras", "extras"
  add_foreign_key "order_extras", "orders"
  add_foreign_key "orders", "services"
  add_foreign_key "reservations", "services"
end
