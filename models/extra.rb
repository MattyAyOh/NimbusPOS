class Extra < ApplicationRecord
  # TODO change the database field to use strings,
  # to conserve the database seeds.
  enum extra_type: ["snack", "drink", "other"]
end
