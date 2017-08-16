var google = require('googleapis')
var googleAuth = require('google-auth-library')
var moment = require('moment')

var clientId = process.env.GOOGLE_CLIENT_ID
var clientSecret = process.env.GOOGLE_CLIENT_SECRET
var redirectUrl = process.env.GOOGLE_REDIRECT_URL
var accessToken = process.env.GOOGLE_ACCESS_TOKEN
var refreshToken = process.env.GOOGLE_REFRESH_TOKEN
var expiryDate = process.env.GOOGLE_EXPIRY_DATE

function getAuthClient() {
  var auth = new googleAuth()
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate
  })
  return oauth2Client
}

function createEvent(authClient, title, startTime, endTime, roomEmail, callback) {
  var calendar = google.calendar('v3')
  var event = {
    summary: title,
    start: { dateTime: moment(startTime).format() },
    end: { dateTime: moment(endTime).format() },
    attendees: [ { email: roomEmail } ]
  }
  calendar.events.insert({
    auth: authClient,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('The API returned an error: ' + err)
      callback(null)
      return
    }
    callback(event)
  })
}

function getEvent(authClient, eventId, callback) {
  var calendar = google.calendar('v3')
  calendar.events.get({
    auth: authClient,
    calendarId: 'primary',
    eventId: eventId,
    maxAttendees: 100
  }, function(err, event) {
    if (err) {
      console.log('The API returned an error: ' + err)
      callback(null)
      return
    }
    callback(event)
  })
}

module.exports = {

  createEvent: (title, startTime, endTime, roomEmail, callback) => {
    createEvent(getAuthClient(), title, startTime, endTime, roomEmail, callback)
  },

  getEvent: (eventId, callback) => {
    getEvent(getAuthClient(), eventId, callback)
  },

  findEvent: (title, startTime, endTime, room, callback) => {
    var calendar = google.calendar('v3')
    var authClient = getAuthClient()
    calendar.events.list({
      auth: getAuthClient(),
      calendarId: 'primary',
      timeMin: endTime.subtract(1, 'seconds').format(),
      timeMax: endTime.add(1, 'seconds').format(),
      maxResults: 3,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err)
        callback(null)
        return
      }
      var events = response.items
      var event = events.find((event) => {
        return event.summary == title && moment(event.start.dateTime).isSame(startTime)
      })
      if (!event || !event.attendees) {
        callback(null)
        return
      }

      getEvent(authClient, event.id, (event) => {
        var matchingAttendee = event.attendees.find((attendee) => {
          return room == null || attendee.email == room
        })
        if (matchingAttendee != null) {
          callback(event)
        } else {
          callback(null)
        }
      })

    })
  },

  deleteEvent: (eventId, callback) => {
    var calendar = google.calendar('v3')
    var authClient = getAuthClient()
    calendar.events.delete({
      auth: getAuthClient(),
      calendarId: 'primary',
      eventId: eventId
    }, function(err, event) {
      if (err) {
        console.log('The API returned an error: ' + err)
        callback(false)
        return
      }
      callback(true)
    })
  }

}
