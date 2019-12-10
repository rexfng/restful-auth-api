# RESTful and AUTH API Server

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/rexfng/restful-auth-api)

## Environment Variables
| Variable Name   |      Description      |  i.e. |
|----------|:-------------|:------|
| MONGODB_DATABASE_URL |[mLab](https://mlab.com/) |mongodb://username:password@ds133321.mlab.com:33321/collection|
| EMAIL_PASS |[Sendgrid](https://sendgrid.com/)|SG.co-H8LFKQamLdbOZXulclw.6GzldaSZGBYbVNcRmxRxiTOb5ZDRdNasd1Xmyt398|
| IPAPI_API_KEY (OPTIONAL) |[IPAPI](https://ipapi.co/#api)|5eeeb81fd0aasdf737b61ad81264ffcasda6e042|
| CORS (OPTIONAL) |DOMAIN of CORS |default to *, i.e: http://sample.herokuapp.com|
| SYSTEM_EMAIL |<From> email address for reset password email | webmaster@example.com |
| APP_NAME |App name | APP |
| TWILIO_API_KEY (OPTIONAL) |Provide to enable SMS capabilities | --- |
| AWS_ACCESS_KEY (OPTIONAL) |For s3upload | --- |
| AWS_SECRET_KEY (OPTIONAL) |For s3upload | --- |
| REDIS_HOST (OPTIONAL) |For googlesheet db routes caching | --- |
| REDIS_PORT (OPTIONAL) |For googlesheet db routes caching | --- |

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
| /resetpassword_confirmation | POST | [username, token, password] |
| /passwordchange | POST | [username, password] |
| /app_create | POST | [username, password] |
| /.well-known/jwks.json | GET | [username, password] |

## Email Route

| Route   | Action | Required Parameters |
|----------|:-------------|:------|
| /email | POST |[from, to, subject, text, html]|

## Two Factor Route

| Route   | Action | Required Parameters |
|----------|:-------------|:------|
| /api/getcode | POST |[label, issuer, period, digits]|
| /api/verifycode | POST |[label, code issuer, period, digits]|
| /sms/getcode | POST |[phone_number, country_code, code_length]|
| /sms/verifycode | POST |[phone_number, country_code, verification_code]|

## Google Sheet DB Route

| Route   | Action | Query Parameters |
|----------|:-------------|:------|
| /googlesheet/:id | GET |[limit, page, q, cached, search_terms, sheet]|

## Security Test Route

| Route   | Action | Required Parameters |
|----------|:-------------|:------|
| /emailtest | POST |[email]|
| /passwordtest | POST |[password]|

## S3 Upload Route

| Route   | Action | Required Parameters |
|----------|:-------------|:------|
| /s3upload | POST |[ttl, bucket, filename, filetype]|
