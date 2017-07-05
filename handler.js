'use strict'

var Utils = require('./lib/utils')
var Lex = require('lex-sdk')

var handlers = {
  'BookMeetingRoom.Dialog': function() {
    this.emit(':tell', "Ok, I've booked Amoy from 8pm today for an hour");
  },

  'BookMeetingRoom.Fulfillment': function() {    
    this.emit(':tell', 'Not yet implemented');    
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
