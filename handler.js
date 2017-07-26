'use strict'

var Utils = require('./lib/utils')
var Lex = require('lex-sdk')

var handlers = {
  'BookMeetingRoom.Dialog': function() {
    // TODO: ... well everything
    this.emit(':tell', "Ok, I've booked Amoy from 8pm today for an hour");
  },

  'BookMeetingRoom.Fulfillment': function() {
    // TODO: Create the actual meeting in Google Calendar!
    console.log("This = ", this)
    console.log("Start Time = ", this.slots.StartTime)
    console.log("MeetingRoom = ", this.slots.MeetingRoom)
    this.emit(':tell', "Ok, I've booked Amoy from 8pm today for an hour");
  }

}

module.exports = {
  bookMeetingRoom: (event, context, callback) => {
    console.log("Event = " + Utils.inspect(event))
    var lex = Lex.handler(event, context)
    lex.registerHandlers(handlers)
    lex.execute()
  }
}
