const express = require('express');
const bodyParser = require('body-parser');
    let app = express(); // Export app for other routes to use
    const port = process.env.PORT || 8000;
    app.use(bodyParser.urlencoded({ // Middleware
      extended: true
    }));
    app.use(bodyParser.json());
    // Routes & Handlers
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  
  var jwt = require('jwt-simple');
  // var secret = 'sumit';
  
  // HS256 secrets are typically 128-bit random strings, for example hex-encoded:
  var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')
  
  // encode
  var payload = { foo: 'bar' };
var token  = jwt.encode(payload, secret);
console.log(token) 
// decode
var decoded = jwt.decode(token, secret);
console.log(decoded); //=> { foo: 'bar' }