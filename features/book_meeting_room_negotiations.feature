Feature: Negotiate with HeyOffice (back and forth with HeyOffice)

  @wip
  Scenario: HeyOffice clarifies when booking should be made
    When I say "Book me a meeting room"
    Then I receive "When would you like the room booking?"

  @wip
  Scenario: Respond to HeyOffice request for clarification
    Given I have been asked to clarify when a room booking should be made
    When I say "now"
    Then I receive "Ok, I've booked Amoy for you now for 1 hour"
    And a calendar event with the following details should be created
      | Title         | Start | End   | Room |
      | Booked by Col | 20:00 | 21:00 | Amoy |

  @wip
  Scenario: HeyOffice negotiates for a smaller room size with you
    Given there are no available rooms for at least 6 people at 8pm
    When I say "Book me a meeting room for 6 people from 8pm"
    Then I receive "Sorry, there are no rooms available today at 8pm for 6 people, but Serangoon which seats 4 people is available. Would you like me to book that?"

  @wip
  Scenario: Respond to HeyOffice negotiation request for room size
    Given I have been asked to negotiate for a smaller room
    When I say "yes"
    Then I receive "Ok, I've booked Serangoon for you from 8pm today"
    And a calendar event with the following details should be created
      | Title         | Start | End   | Room |
      | Booked by Col | 20:00 | 21:00 | Serangoon |
