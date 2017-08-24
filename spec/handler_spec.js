const nock = require('nock')
const sinon = require('sinon')
const handler = require('../handler')
const CalendarUtils = require('../lib/calendar_utils')
var moment = require('moment-timezone')

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

  beforeEach(() => {
    sinon.stub(CalendarUtils, 'createEvent')
  })

  afterEach(() => {
    sinon.restore(CalendarUtils, 'createEvent')
  })

  describe('ask to book a meeting room with no details', () => {
    it('should prompt for a start time', (done) => {
        var event = testEvent('BookMeetingRoom', 'DialogCodeHook', {}, {StartTime: null, MeetingRoom: null})

        handler.bookMeetingRoom(event, {
          succeed: function(response) {
            var expectedResponse = {
              sessionAttributes: {},
              dialogAction: {
                type: "ElicitSlot",
                slotToElicit: "StartTime",
                intentName: "BookMeetingRoom",
                slots: {
                  StartTime: null,
                  MeetingRoom: null
                }
              }
            }
            expect(response).toEqual(expectedResponse)
            expect(response.dialogAction.type).toEqual("ElicitSlot")
            expect(response.dialogAction.slotToElicit).toEqual("StartTime")
            sinon.assert.notCalled(CalendarUtils.createEvent)
            done()
          }
        })
    })
  })

  describe('ask to book a meeting room by name with a start time', () => {
    it('should book the meeting room', (done) => {
      var event = testEvent('BookMeetingRoom', 'DialogCodeHook', {}, {StartTime: "20:00", MeetingRoom: "Amoy"})
      var expectedEvent = {}
      CalendarUtils.createEvent.callsArgWith(4, expectedEvent)

      handler.bookMeetingRoom(event, {
        succeed: function(response) {
          expect(response.dialogAction.message.content).toEqual("Ok, I've booked Amoy from 8pm today for an hour")
          var expectedStartTime = moment().tz('Asia/Singapore').hours(20).minutes(0).seconds(0).milliseconds(0)
          var expectedEndTime = moment().tz('Asia/Singapore').hours(21).minutes(0).seconds(0).milliseconds(0)
          sinon.assert.calledWith(CalendarUtils.createEvent, 'Booked by HeyOffice', expectedStartTime, expectedEndTime, 'thoughtworks.singapore+amoy@gmail.com')
          done()
        }
      })
    })
  })

  describe('fulfill a request for room by name and start time', () => {

    it('should book the meeting room', (done) => {
      var event = testEvent('BookMeetingRoom', 'FulfillmentCodeHook', {}, {StartTime: "20:00", MeetingRoom: "Amoy"})
      var expectedEvent = {
        summary: 'Booked by HeyOffice',
        start: { dateTime: 'blah' },
        end: { dateTime: 'blah' },
        attendees: [ { email: 'thoughtworks.singapore+amoy@gmail.com' } ]
      }
      CalendarUtils.createEvent.callsArgWith(4, expectedEvent)

      handler.bookMeetingRoom(event, {
        succeed: function(response) {
          expect(response.dialogAction.message.content).toEqual("Ok, I've booked Amoy from 8pm today for an hour")
          var expectedStartTime = moment().tz('Asia/Singapore').hours(20).minutes(0).seconds(0).milliseconds(0)
          var expectedEndTime = moment().tz('Asia/Singapore').hours(21).minutes(0).seconds(0).milliseconds(0)
          sinon.assert.calledWith(CalendarUtils.createEvent, 'Booked by HeyOffice', expectedStartTime, expectedEndTime, 'thoughtworks.singapore+amoy@gmail.com')
          done()
        }
      })
    })

  })

})
