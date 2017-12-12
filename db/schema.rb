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

ActiveRecord::Schema.define(version: 20171212194513) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "extras", force: :cascade do |t|
    t.string "name"
    t.integer "price"
    t.integer "extra_type", default: 0
    t.string "image_url"
  end

  create_table "order_extras", force: :cascade do |t|
    t.bigint "order_id"
    t.bigint "extra_id"
    t.integer "quantity"
    t.integer "price"
    t.index ["extra_id"], name: "index_order_extras_on_extra_id"
    t.index ["order_id"], name: "index_order_extras_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "service_id"
    t.datetime "start_time"
    t.datetime "end_time"
    t.float "total_time"
    t.float "services_cost"
    t.float "extras_cost"
    t.float "previous_cost", default: 0.0
    t.float "total_cost"
    t.integer "status", default: 0
    t.index ["service_id"], name: "index_orders_on_service_id"
  end

  create_table "sales", force: :cascade do |t|
    t.float "cash_handled"
    t.bigint "service_id"
    t.bigint "order_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "date"
    t.string "weekday"
    t.float "time_spent"
    t.float "total_bill"
    t.index ["order_id"], name: "index_sales_on_order_id"
    t.index ["service_id"], name: "index_sales_on_service_id"
  end

  create_table "services", force: :cascade do |t|
    t.string "name"
    t.integer "status", default: 0
    t.integer "hourly_rate"
    t.integer "position"
    t.integer "service_type", default: 0
  end

  add_foreign_key "order_extras", "extras"
  add_foreign_key "order_extras", "orders"
  add_foreign_key "orders", "services"
  add_foreign_key "sales", "orders"
  add_foreign_key "sales", "services"
end
