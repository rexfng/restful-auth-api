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
let allowedOrigins = _.isEmpty(process.env.CORS) ? [] : process.env.CORS.split(',')
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
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
    ]
}));
app.get('/',function(req,res){
    res.redirect('https://github.com/rexfng/restful-auth-api')
})
app.use('/register', Auth.routes.api.register) // POST /register
app.use('/resetpassword', Auth.routes.api.resetpassword) // POST /register
app.use('/login', Auth.routes.api.login) // POST /login
app.use('/token', Auth.routes.api.token) // POST /token
app.use('/passwordchange', Auth.routes.api.passwordChange) // POST /token

if (process.env.TWILIO_API_KEY) {
    app.use('/sms/getcode', Tfa.routes.sms.getcode)
    app.use('/sms/verifycode', Tfa.routes.sms.verifycode)
}
app.use('/api/getcode', Tfa.routes.api.getcode)
app.use('/api/verifycode', Tfa.routes.api.verifycode)
app.use('/email/getcode', Tfa.routes.email.getcode)
app.use('/verification', Tfa.routes.email.verifycode)
app.use('/email', Send.routes.email)

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
