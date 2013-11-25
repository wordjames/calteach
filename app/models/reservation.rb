class Reservation < ActiveRecord::Base

  attr_accessible :date_in, :date_out, :item_id, :notes, :reservation_in, :reservation_out, :user_id, :user, :quantity

  belongs_to :user
  belongs_to :item

  def self.hide_archived
    Reservation.where(:archived => nil)
  end

  def self.email_reminders
    puts "cron job run"
    current_time = Time.zone.now
    reminder_time = 60 * 60 * 24 # Time in seconds before due date
    checked_out = Reservation.where("date_out IS NOT NULL", :date_in => nil)
    checked_out.each do |current_reservation|
      if (current_reservation.reservation_in  \
          and (current_reservation.reservation_in - current_time) > 0 \
          and (current_reservation.reservation_in - current_time) < reminder_time)
        user = User.find(current_reservation.user_id)
        UserMailer.return_reminder(user).deliver
        puts current_time
      end
    end
  end

  def get_status
    if self.archived
      "Archived"
    elsif self.canceled
      "Canceled"
    elsif self.date_in and self.date_out
      "Checked In"
    elsif self.date_out and not self.date_in
      "Checked Out"
    else
      "Reserved"
    end    
  end

  def overlaps?(start_date, end_date)
    if self.reservation_out
      if self.reservation_out >= start_date and self.reservation_out <= end_date
        true
      elsif reservation_in
        if (self.reservation_in >= start_date and self.reservation_in <= end_date) or
           (self.reservation_out <= start_date and self.reservation_in >= end_date)
          true
        end
      end
    elsif (self.date_out and self.date_out >= start_date and self.date_out <= end_date)
      true
    end
    false
  end

  #Performs basic sanity checks on the start and end dates.
  def self.valid_reservation?(start_date, end_date, item, quantity_desired)
    if !start_date or !end_date
      false
    elsif quantity_desired == 0
      false
    elsif item.quantity_available(start_date, end_date) < quantity_desired
      false
    elsif end_date > item.get_due_date.business_days.after(start_date.to_datetime).to_date
      false
    else
      true
    end
  end

end
