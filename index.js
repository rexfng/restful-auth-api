// const env = require('dotenv').config()
// EXPRESS SERVER
const express = require('express')
const app = express()
	  app.listen(process.env.PORT || 3000)

//ip middleware
const requestIp = require('request-ip');
const cors = require('cors')
const keypair = require('keypair');
  let pair = keypair({bits: 1024})
process.env.PUBLIC_KEY = pair.public
process.env.PRIVATE_KEY = pair.private
const Send = require('@rexfng/send')
const _ = require('lodash')
app.use(requestIp.mw())
var whitelist = _.isEmpty(process.env.CORS) ? ["*"] : process.env.CORS.split(',')
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || _.includes(whitelist, '*')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}));

const Auth = require('@rexfng/auth')
const authCheck = Auth.middleware.authCheck
const bearerToken = require('express-bearer-token'); 
const Tfa = require('@rexfng/tfa')
const s3upload = require('@rexfng/s3upload')

app.use(bearerToken());
app.use(authCheck().unless({ 
    path: [
        '/', 
        '/register',
        '/login',
        '/token',
        '/resetpassword',
        '/resetpassword_confirmation',
        '/passwordchange',
        '/api/getcode',
        '/api/verifycode',
        '/sms/getcode',
        '/sms/verifycode',
        '/email/getcode',
        '/verification',
        '/.well-known/jwks.json',
        '/app_create',

    ]
}));
app.get('/',function(req,res){
    res.redirect('https://github.com/rexfng/restful-auth-api')
})
app.use('/register', Auth.routes.api.register) // POST /register
if (process.env.EMAIL_PASS || process.env.SYSTEM_EMAIL) {
    app.use('/resetpassword', Auth.routes.api.resetpassword) // POST /register
    app.use('/resetpassword_confirmation', Auth.routes.api.resetpassword_confirmation) // POST /register
    app.use('/', Send.routes.email)
}
app.use('/login', Auth.routes.api.login) // POST /login
app.use('/token', Auth.routes.api.token) // POST /token
app.use('/passwordchange', Auth.routes.api.passwordChange) // POST /token
app.use('/.well-known/jwks.json', Auth.routes.api.jwks) // POST /token
app.use('/app_create', Auth.routes.api.app_create) // POST /token

if (process.env.TWILIO_API_KEY) {
    app.use('/sms/getcode', Tfa.routes.sms.getcode)
    app.use('/sms/verifycode', Tfa.routes.sms.verifycode)
}
app.use('/api/getcode', Tfa.routes.api.getcode)
app.use('/api/verifycode', Tfa.routes.api.verifycode)
app.use('/googlesheet', require('@rexfng/google-sheet-db').api.searchSheetData)
app.use('/passwordtest', require('@rexfng/password-strength').routes.passwordTest)
app.use('/emailtest', require('@rexfng/password-strength').routes.emailTest)


if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
    app.use('/s3upload', s3upload)
}

// MONGODB
const MongoDB = require('@rexfng/db')
const DB = new MongoDB()

app.use('/', DB.routes.get)
app.use('/', DB.routes.gets)
app.use('/', DB.routes.post)
app.use('/', DB.routes.put)
app.use('/', DB.routes.del)
