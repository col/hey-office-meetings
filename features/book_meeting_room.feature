Feature: Book meeting room at a set time today

  Scenario: Don't specify any details
    When I say "Book me a meeting room"
    Then I receive "What time do you need the room?"

  Scenario: Specify room and start time
    When I say "Book me the Amoy meeting room for 8pm"
    Then I receive "Ok, I've booked Amoy from 8pm today for an hour"
    And a calendar event with the following details should be created
      | Title               | Start | End   | Room |
      | Booked by HeyOffice | 20:00 | 21:00 | Amoy |

  Scenario: HeyOffice cannot find any available meeting room for the start time specified
    Given there is already a booking for 8pm
    When I say "Book me a meeting room for 8pm"
    Then I receive "Sorry, there are no rooms available today at 8pm"

  Scenario: Specify number of people and start time
    When I say "Book me a meeting room for 6 people from 8pm"
    Then I receive "Ok, I've booked Amoy for you from 8pm today"
    And a calendar event with the following details should be created
      | Title         | Start | End   | Room |
      | Booked by Col | 20:00 | 21:00 | Amoy |

  Scenario: HeyOffice cannot find a room available which can accomodate specified number of people or more
    Given there are no available rooms for at least 6 people at 8pm
    When I say "Book me a meeting room for 6 people from 8pm"
    Then I receive "Sorry, there are no rooms available today at 8pm for 6 people"

  Scenario: Specify capability and start time
    When I say "Book me a meeting for a video conference at 8pm"
    Then I receive "Ok, I've booked Amoy for you from 8pm today"
    And a calendar event with the following details should be created
      | Title         | Start | End   | Room |
      | Booked by Col | 20:00 | 21:00 | Amoy |

  Scenario: HeyOffice cannot find an available room with the requested capability
    Given there are no available rooms with video conferencing at 8pm
    When I say "Book me a meeting for a video conference at 8pm"
    Then I receive "Sorry, there are no rooms available today at 8pm with video conferencing capabilities"

  Scenario: HeyOffice responds to query on when a room with a specific capability becomes available
    Given there are no available rooms with video conferencing at 8pm
    And Amoy becomes available from 8:30pm for at least 1hour
    When I say "When is a room with video conferencing available"
    Then I receive "Amoy is available from 8:30pm"

  Scenario: Specify duration and start time
    When I say "Book me a meeting from 8pm for 2 hours"
    Then I receive "Ok, I've booked Amoy for you from 8-10pm today"
    And a calendar event with the following details should be created
      | Title         | Start | End   | Room |
      | Booked by Col | 20:00 | 22:00 | Amoy |

  Scenario: Specify duration and start time
    Given there are no available rooms from 8pm for 2 hours
    When I say "Book me a meeting from 8pm for 2 hours"
    Then I receive "Sorry, there are no rooms available today at 8pm for 2 hours"

  Scenario: Specify start time and end time
    When I say "Book me a meeting from 8 to 11pm"
    Then I receive "Ok, I've booked Amoy for you from 8 to 11pm today"
    And a calendar event with the following details should be created
      | Title         | Start | End   | Room |
      | Booked by Col | 20:00 | 23:00 | Amoy |

  Scenario: Specify start time and end time
    Given there are no available rooms from 8 to 11pm
    When I say "Book me a meeting from 8 to 11pm"
    Then I receive "Sorry, there are no rooms available today from 8 to 11pm"

  Scenario: HeyOffice responds to query on when any room will become available
    Given there are no rooms available now
    And Amoy becomes available from 8:30pm for at least 1 hour
    When I say "When is a room free/available"
    Then I receive "Amoy is available from 8:30pm"

  Scenario: HeyOffice responds to query on when any room will become available for 2 hours
    Given there are no rooms available now for 2 hours
    And Amoy becomes available from 8:30pm for at least 2 hours
    When I say "When is a room free/available for 2 hours"
    Then I receive "Amoy is available from 8:30pm"

  Scenario: HeyOffice responds to query on when a specific room will become available
    Given Amoy is not available now
    And Amoy becomes available from 8:30pm for at least 1 hour
    When I say "When is Amoy free/available"
    Then I receive "Amoy is available from 8:30pm"

  Scenario: HeyOffice responds to query on when a specific room will become available for 2 hours
    Given Amoy is not available now for 2 hours
    And Amoy becomes available from 8:30pm for at least 2 hours
    When I say "When is Amoy free/available for 2 hours"
    Then I receive "Amoy is available from 8:30pm"
