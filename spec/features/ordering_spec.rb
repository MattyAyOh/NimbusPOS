require 'rails_helper'

describe 'Ordering Process' do
  describe 'cash handled tracking' do
    let!(:service) { Service.create!(name: 'Mahjong 1', status: 'open', hourly_rate: 40) }

    it 'allows storage of amount of cash handled for an order' do
      visit '/'

      expect(page).to have_link service.name
      click_on service.name

      expect(page).to have_content 'New Order'
      click_on 'Create Order'

      expect(page).to have_content 'TOTALS'
      fill_in 'Cash Handled', with: '123.45'
      click_on 'Checkout'

      expect(page).to have_content 'Sale has successfully been recorded!'

      visit '/sales'
      expect(page).to have_content 'Cash Handled: $123.45'
    end
  end
end
