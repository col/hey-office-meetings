const nock = require('nock')
const sinon = require('sinon')
const handler = require('../handler')
const CalendarUtils = require('../lib/calendar_utils')
var moment = require('moment')

function testEvent(intentName, invocationSource, sessionAttributes, slots) {
  intentName = intentName || 'TestIntent'
  invocationSource = invocationSource || 'FulfillmentCodeHook'
  sessionAttributes = sessionAttributes || {}
  slots = slots || {}
  return {
    sessionAttributes: sessionAttributes,
    invocationSource: invocationSource,
    currentIntent: {
      name: intentName,
      slots: slots
    }
  }
}

describe('BookMeetingRoom Handler', () => {

  // describe('ask to book a meeting room with no details', () => {
  //   it('should prompt for a start time', (done) => {
  //       // TODO: ...wait for this to be driven by a feature test
  //   })
  // })

  // describe('ask to book a meeting room by name with a start time', () => {
  //   it('should tell us it booked the meeting room', (done) => {
  //     var event = testEvent('BookMeetingRoom', 'DialogCodeHook', {}, {StartTime: "20:00", MeetingRoom: "Amoy"})
  //     handler.bookMeetingRoom(event, {
  //       succeed: function(response) {
  //         expect(response.dialogAction.message.content).toEqual("Ok, I've booked Amoy from 8pm today for an hour")
  //         done()
  //       }
  //     })
  //   })
  // })

  describe('fulfill a request for room by name and start time', () => {

    it('should book the meeting room', (done) => {
      var event = testEvent('BookMeetingRoom', 'FulfillmentCodeHook', {}, {StartTime: "20:00", MeetingRoom: "Amoy"})
      var expectedEvent = {}
      sinon.stub(CalendarUtils, 'createEvent').callsArgWith(4, expectedEvent)

      handler.bookMeetingRoom(event, {
        succeed: function(response) {
          console.log("Response = ", response)
          expect(response.dialogAction.message.content).toEqual("Ok, I've booked Amoy from 8pm today for an hour")          
          var expectedStartTime = moment().hours(20).minutes(0).seconds(0).milliseconds(0)
          var expectedEndTime = moment().hours(21).minutes(0).seconds(0).milliseconds(0)
          sinon.assert.calledWith(CalendarUtils.createEvent, 'Booked by HeyOffice', expectedStartTime, expectedEndTime, 'charris@thoughtworks.com')
          done()
        }
      })
    })

  })

})
