var {defineSupportCode} = require('cucumber')
var AWS = require('aws-sdk')
var expect = require('chai').expect

var google = require('googleapis')
var googleAuth = require('google-auth-library')

var CalendarUtils = require('../../lib/calendar_utils')
var moment = require('moment')

const Lex = new AWS.LexRuntime({
  apiVersion: '2016-11-28',
  signatureVersion: 'v4',
  region: 'us-east-1'
})

var botName = "HeyOffice"
var aliasName = "$LATEST"
var userId = "123456789"

function buildLexRequestParams(input) {
  return {
    botAlias: aliasName,
    botName: botName,
    inputText: input,
    userId: userId,
    sessionAttributes: {}
  }
}

var response = null;

defineSupportCode(function({Then, When}) {

    When(/^I say "([^"]*)"$/, function(input, callback) {
        var params = buildLexRequestParams(input)
        Lex.postText(params, function(err, data) {
          response = data.message
          callback()
        })
    })

    Then(/^I receive "([^"]*)"$/, function(output, callback) {
        expect(response).to.equal(output)
        callback()
    })

    Then(/^a calendar event with the following details should be created$/, function(table, callback) {
      var data = table.hashes()[0]

      var startHourMin = data.Start.split(":")
      var startTime = moment().hours(startHourMin[0]).minutes(startHourMin[1]).seconds(0).milliseconds(0)

      var endHourMin = data.End.split(":")
      var endTime = moment().hours(endHourMin[0]).minutes(endHourMin[1]).seconds(0).milliseconds(0)

      CalendarUtils.findEvent(data.Title, startTime, endTime, null, (event) => {
        expect(event).to.not.be.null
        callback()
      })

    })

})
