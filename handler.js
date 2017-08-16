'use strict'

var Utils = require('./lib/utils')
var Lex = require('lex-sdk')
var CalendarUtils = require('./lib/calendar_utils')
var moment = require('moment-timezone')

var handlers = {

  'BookMeetingRoom.Dialog': function() {

    if (!this.slots.StartTime) {
      this.emit(':elicit', 'StartTime', {})
    }
    else if (!this.slots.MeetingRoom) {
      this.emit(':elicit', 'MeetingRoom', {})
    }
    else {
      this.emit('BookMeetingRoom.Fulfillment')
    }
  },

  'BookMeetingRoom.Fulfillment': function() {
    var startHourMin = this.slots.StartTime.split(":")
    var startTime = moment().tz('Asia/Singapore').hours(startHourMin[0]).minutes(startHourMin[1]).seconds(0).milliseconds(0)
    var endTime = moment(startTime).add(1, 'hours')
    console.log(`Creating event with: title: 'Booked by HeyOffice', startTime: ${startTime.format()}, endTime: ${endTime.format()}, roomEmail: 'charris@thoughtworks.com'`)
    CalendarUtils.createEvent('Booked by HeyOffice', startTime, endTime, 'charris@thoughtworks.com', (event) => {
      console.log(`Created an event!`)
      console.log("Event:", Utils.inspect(event))
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
