var google = require('googleapis')
var googleAuth = require('google-auth-library')
var moment = require('moment')

// TODO: Need to get a new access token that has write access!!!
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
  calendar.events.insert({
    auth: authClient,
    calendarId: 'primary',
    end: { dateTime: moment(endTime).format() },
    start: { dateTime: moment(startTime).format() },
    attendees: [ { email: roomEmail } ],
    summary: title,
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
  }

}
