// const env = require('dotenv').config()
// EXPRESS SERVER
const express = require('express')
const app = express()
	  app.listen(process.env.PORT || 3000)
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
//ip middleware
const requestIp = require('request-ip');
const cors = require('cors')
const keypair = require('keypair');
  let pair = keypair({bits: 1024})
process.env.PUBLIC_KEY = pair.public
process.env.PRIVATE_KEY = pair.private
const _ = require('lodash')
const MongoDB = require('@rexfng/db')
let DB = new MongoDB()
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
const Send = require('@rexfng/send')

app.use(bearerToken());
app.use(authCheck().unless({ 
    path: [
        '/', 
        '/register',
        '/login',
        '/token',
        '/email/resetpassword',
        '/email/resetpassword_confirmation',
        '/sms/resetpassword',
        '/sms/resetpassword_confirmation',
        '/voice/resetpassword',
        '/voice/resetpassword_confirmation',
        '/passwordchange',
        '/api/getcode',
        '/api/verifycode',
        '/sms/getcode',
        '/sms/verifycode',
        '/email/getcode',
        '/verification',
        '/username',
        '/sms/webhook',
        '/.well-known/jwks.json',
        '/app_create',
        '/voice/getcode',
        '/twixml'

    ]
}));
app.get('/',function(req,res){
    res.redirect('https://github.com/rexfng/restful-auth-api')
})
app.get('/empty',function(req,res){
    res.status(200).send('success')
})
app.use('/register', Auth.routes.api.register) // POST /register
if (process.env.EMAIL_PASS || process.env.SYSTEM_EMAIL) {
    app.use('/email/resetpassword', Auth.routes.api.resetpassword.email) // POST /register
    app.use('/email/resetpassword_confirmation', Auth.routes.api.resetpassword.email_confirmation) // POST /register
    app.use('/email', Send.routes.email)
}
app.use('/login', Auth.routes.api.login) // POST /login
app.use('/token', Auth.routes.api.token) // POST /token
app.use('/passwordchange', Auth.routes.api.passwordChange) // POST /token

if (process.env.TWILIO_API_KEY) {
    app.use('/sms/getcode', Tfa.routes.sms.getcode)
    app.use('/sms/verifycode', Tfa.routes.sms.verifycode)
    app.use('/sms/send', Send.routes.sms.send)
    app.use('/sms/webhook', Send.routes.sms.webhook)
    app.use('/voice', Send.routes.voice)
    app.use('/voice/getcode', Tfa.routes.voice.getcode)
    app.use('/twixml', Send.routes.twixml)
    app.use('/sms/resetpassword', Auth.routes.api.resetpassword.sms) // POST /register
    app.use('/sms/resetpassword_confirmation', Auth.routes.api.resetpassword.sms_confirmation) // POST /register
}
if (process.env.TWILIO_AUTHY_API_KEY) {
    app.use('/voice/resetpassword', Auth.routes.api.resetpassword.voice) // POST
    app.use('/voice/resetpassword_confirmation', Auth.routes.api.resetpassword.voice_confirmation) //    
}
app.use('/api/getcode', Tfa.routes.api.getcode)
app.use('/api/verifycode', Tfa.routes.api.verifycode)
app.use('/googlesheet', require('@rexfng/google-sheet-db').api.searchSheetData)
app.use('/passwordtest', require('@rexfng/password-strength').routes.passwordTest)
app.use('/emailtest', require('@rexfng/password-strength').routes.emailTest)
app.post('/username', jsonParser , function(req,res){
    DB.model.find(Object.assign({"type": "users"}, req.body)).select('_id data.username').limit(1).lean()
        .then(function(e){
            res.status(200).send(e)
            // console.log(e)
        })
        .catch(function(e){
            res.status(500).send(e)
            console.log(e)
        })
})


if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
    app.use('/s3upload/read', s3upload.routes.read)
    app.use('/s3upload/update', s3upload.routes.update)
    app.use('/s3upload/delete', s3upload.routes.delete)
}
// MONGODB

app.use('/db', DB.routes.get)
app.use('/db', DB.routes.gets)
app.use('/db', DB.routes.post)
app.use('/db', DB.routes.put)
app.use('/db', DB.routes.del)
