const nock = require('nock')
const sinon = require('sinon')
const handler = require('../handler')

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

  describe('request room by name and start time', () => {

    it('should tell us it booked the meeting room', (done) => {
      var event = testEvent('BookMeetingRoom', 'DialogCodeHook', {}, {StartTime: "20:00", MeetingRoom: "Amoy"})
      handler.bookMeetingRoom(event, {
        succeed: function(response) {
          expect(response.dialogAction.message.content).toEqual("Ok, I've booked Amoy from 8pm today for an hour")
          done()
        }
      })
    })

  })

  describe('fulfill a request for room by name and start time', () => {

    it('should book the meeting room', (done) => {
      var event = testEvent('BookMeetingRoom', 'FulfillmentCodeHook', {}, {StartTime: "20:00", MeetingRoom: "Amoy"})
      handler.bookMeetingRoom(event, {
        succeed: function(response) {
          console.log("Response = ", response)
          expect(response.dialogAction.message.content).toEqual("Ok, I've booked Amoy from 8pm today for an hour")
          done()
        }
      })
    })

  })

})
