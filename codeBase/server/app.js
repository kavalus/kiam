const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');  
// Connect To Database
mongoose.connect(config.database+config.args);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connecting to database ...');
}).then(() => { // if all is ok we will be here
  console.log('Authenticated to the database '+config.database);
})
.catch(err => { // we will not be here...
  console.error('MongoDb Connection Error', err);
});


const app = express();

const api = require('./routes/api');
const users = require('./routes/users');
const ConfigRoute = require('./routes/configRoute') 
const LDAPRoute = require('./routes/ldapRoute') 


// Port Number
const port = 3001;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.use('/api', api);
app.use('/users', users);
app.use('/configure',ConfigRoute)
app.use('/connectLDAP',LDAPRoute )

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});

