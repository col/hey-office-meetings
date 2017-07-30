var google = require('googleapis')
var googleAuth = require('google-auth-library')
var readline = require('readline')

var SCOPES = ['https://www.googleapis.com/auth/calendar']
var auth = new googleAuth()

// these parameters can be obtained from client_secret.json file
var clientId = process.env.GOOGLE_CLIENT_ID
var clientSecret = process.env.GOOGLE_CLIENT_SECRET
var redirectUrl = process.env.GOOGLE_REDIRECT_URL
var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

function getNewToken(oauth2Client) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	})
	console.log('Authorize this application by visiting this url: ' + authUrl)

	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	rl.question('Enter the code from that page here: ', function (code) {
		rl.close()
		oauth2Client.getToken(code, function (err, token) {
			if (err) {
				console.log('Error trying to access the token', err)
				return
			}
			oauth2Client.credentials = token
      console.log(token)
			return oauth2Client
		})
	})
}

getNewToken(oauth2Client)
