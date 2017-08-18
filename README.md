### Modules to book meeting rooms with Google Calendar integration

Notes:

* Make sure you install serverless with version greater than 1.10
* To invoke function locally run:
`serverless invoke local --function hello`


## Run Tests

Be sure to pull in latest version of col/lex-sdk package by running `npm update`

```
npm test
```

## Run Feature Tests

Be sure to source Google Calendar credentials as environment variables (can be found in LastPass Note) before running feature tests

```
npm run features
```

or

```
npm run features features/book_meeting_room.feature:3
```


## Deploy

```
serverless deploy
```
