require 'rails_helper'

describe 'Ordering Process' do
  let!(:service) { Service.create!(name: 'Mahjong 1', hourly_rate: 40) }

  describe 'cash handled tracking' do
    it 'allows storage of amount of cash handled for an order' do
      visit '/'

      expect(page).to have_link service.name
      click_on service.name

      expect(page).to have_content 'New Order'
      click_on 'Create Order'

      expect(page).to have_content 'TOTALS'
      fill_in 'Cash Handled', with: '123.45'
      click_on 'Checkout'
    end
  end

  describe 'editing an order' do
    it 'puts extras in appropriate places' do
      Extra.create!(name: 'Oreos', extra_type: 'snack')
      Extra.create!(name: 'Cucumbers', extra_type: 'snack')
      Extra.create!(name: 'Beer', extra_type: 'drink')
      Extra.create!(name: 'Vodka', extra_type: 'drink')

      visit '/'
      click_on service.name
      expect(page).to have_content 'New Order'

      within '#snack-order-extras' do
        expect(page).to have_content 'Oreos'
        expect(page).to have_content 'Cucumbers'
        expect(page).not_to have_content 'Beer'
        expect(page).not_to have_content 'Vodka'
      end

      within '#drink-order-extras' do
        expect(page).not_to have_content 'Oreos'
        expect(page).not_to have_content 'Cucumbers'
        expect(page).to have_content 'Beer'
        expect(page).to have_content 'Vodka'
      end

      click_on 'Create Order'

      expect(page).to have_content 'TOTALS'
      click_on 'Update Order'

      within '#snack-order-extras' do
        expect(page).to have_content 'Oreos'
        expect(page).to have_content 'Cucumbers'
        expect(page).not_to have_content 'Beer'
        expect(page).not_to have_content 'Vodka'
      end

      within '#drink-order-extras' do
        expect(page).not_to have_content 'Oreos'
        expect(page).not_to have_content 'Cucumbers'
        expect(page).to have_content 'Beer'
        expect(page).to have_content 'Vodka'
      end
    end
  end
end
