'use strict'

var Utils = require('./lib/utils')
var Lex = require('lex-sdk')
var CalendarUtils = require('./lib/calendar_utils')
var Rooms = require('./lib/rooms')
var moment = require('moment-timezone')

var handlers = {

  'BookMeetingRoom.Dialog': function() {

    if (!this.slots.StartTime) {
      this.emit(':elicit', 'StartTime')
    }
    else if (!this.slots.MeetingRoom) {
      this.emit(':elicit', 'MeetingRoom')
    }
    else {
      this.emit('BookMeetingRoom.Fulfillment')
    }
  },

  'BookMeetingRoom.Fulfillment': function() {
    var startHourMin = this.slots.StartTime.split(":")
    var startTime = moment().tz('Asia/Singapore').hours(startHourMin[0]).minutes(startHourMin[1]).seconds(0).milliseconds(0)
    var endTime = moment(startTime).add(1, 'hours')
    var room = Rooms.findByName(this.slots.MeetingRoom)
    debug(`Creating event with: title: 'Booked by HeyOffice', startTime: ${startTime.format()}, endTime: ${endTime.format()}, roomEmail: '${room.email}'`)
    CalendarUtils.createEvent('Booked by HeyOffice', startTime, endTime, room.email, (event) => {
      if (event) {
        debug(`Created an event!`)
        debug("Event:", Utils.inspect(event))
        this.emit(':tell', `Ok, I've booked ${room.name} from ${startTime.format("ha")} today for ${endTime.from(startTime, true)}`)
      } else {
        this.emit(':tell', `Sorry, there was an issue with the booking. Please try again later.`)
      }
    })
  }

}

function debug(message, arg) {
  if (process.env.NODE_ENV != "test") {
    console.log(message, arg)
  }
}

module.exports = {
  bookMeetingRoom: (event, context, callback) => {
    debug("Event = ", Utils.inspect(event))
    var lex = Lex.handler(event, { succeed: (response) => {
      debug("Response = ", Utils.inspect(response))
      context.succeed(response)
    }})
    lex.registerHandlers(handlers)
    lex.execute()
  }
}
