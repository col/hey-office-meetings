'use strict'

var Utils = require('./lib/utils')
var Lex = require('lex-sdk')
var CalendarUtils = require('./lib/calendar_utils')
var moment = require('moment')

var handlers = {
  'BookMeetingRoom.Dialog': function() {
    // TODO: ... well everything
    this.emit(':tell', "I have no idea what's going on.")
  },

  'BookMeetingRoom.Fulfillment': function() {
    var startHourMin = this.slots.StartTime.split(":")
    var startTime = moment().hours(startHourMin[0]).minutes(startHourMin[1]).seconds(0).milliseconds(0)
    var endTime = moment(startTime).add(1, 'hours')
    CalendarUtils.createEvent('Booked by HeyOffice', startTime, endTime, 'charris@thoughtworks.com', (event) => {
      this.emit(':tell', `Ok, I've booked Amoy from ${startTime.format("ha")} today for ${endTime.from(startTime, true)}`)
    })
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
