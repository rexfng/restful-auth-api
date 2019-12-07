# RESTful and AUTH API Server

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/rexfng/restful-auth-api)

## Environment Variables
| Variable Name   |      Description      |  i.e. |
|----------|:-------------|:------|
| MONGODB_DATABASE_URL |[mLab](https://mlab.com/) |mongodb://username:password@ds133321.mlab.com:33321/collection|
| EMAIL_PASS |[Sendgrid](https://sendgrid.com/)|SG.co-H8LFKQamLdbOZXulclw.6GzldaSZGBYbVNcRmxRxiTOb5ZDRdNasd1Xmyt398|
| IPAPI_API_KEY (OPTIONAL) |[IPAPI](https://ipapi.co/#api)|5eeeb81fd0aasdf737b61ad81264ffcasda6e042|
| CORS (OPTIONAL) |DOMAIN of CORS |default to *, i.e: http://sample.herokuapp.com|

## RESTful Routes
Endpoints are created from [@rexfng/db](https://www.npmjs.com/package/@rexfng/db) Node Module. Check for detail documentation.
| Route   | Action | Description |
|----------|:-------------|:------|
| /:collection | GET | Get all records from collection |
| /:collection | POST | Create a record in a collection |
| /:collection/:id | GET | GET a record in a collection by ID |
| /:collection/:id | PUT | Update a record in a collection by ID |
| /:collection/:id | DELETE | Delete a record in a collection by ID |

## Auth Routes
Endpoints are created from [@rexfng/auth](https://www.npmjs.com/package/@rexfng/auth) Node Module. Check for detail documentation.
| Route   | Action | Required Parameters |
|----------|:-------------|:------|
| /register | POST |[username (email), password]|
| /login | POST | [username (email), password] |
| /token | POST | [refresh_token] |
| /resetpassword | POST | [username, from, to, subject, text, html] |
| /resetpassword_confirmation | POST | [code, password] |