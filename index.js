const env = require('dotenv').config()
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

const _ = require('lodash')
app.use(requestIp.mw())
app.use(cors())
let corsResource = _.isEmpty(process.env.CORS) ? "*" : process.env.CORS
app.options(corsResource, cors());

// AUTH
const Auth = require('@rexfng/auth')
const authCheck = Auth.middleware.authCheck
const bearerToken = require('express-bearer-token'); 
 
app.use(bearerToken());
app.use(authCheck().unless({ 
    path: [
        '/', 
        '/register',
        '/login',
        '/token',
        '/resetpassword',
        '/resetpassword_confirmation'
    ]
}));
app.use('/register', Auth.routes.api.register) // POST /register
app.use('/resetpassword', Auth.routes.api.resetpassword) // POST /register
app.use('/resetpassword_confirmation', Auth.routes.api.resetpassword_confirmation) // POST /register
app.use('/login', Auth.routes.api.login) // POST /login
app.use('/token', Auth.routes.api.token) // POST /token

// MONGODB
const MongoDB = require('@rexfng/db')
const DB = new MongoDB()

app.use('/', DB.routes.get)
app.use('/', DB.routes.gets)
app.use('/', DB.routes.post)
app.use('/', DB.routes.put)
app.use('/', DB.routes.del)
