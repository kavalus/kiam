const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');  
const api = require('./api');


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




// Port Number
const port = 4000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



// require('./config/passport')(passport);

app.use('/api', api);

// Index Route
// app.get('/', (req, res) => {
//   res.send('Invalid Endpoint');
// });

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
