const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const proxy = require('http-proxy-middleware');
const request = require('request');
var hashTable = require("node-hashtable");
const login = require('./login')
var Cookies = require('cookies')
var keys = ['keyboard cat']
var jwt = require('jwt-simple');
var webserver = require('./config')
// HS256 secrets are typically 128-bit random strings, for example hex-encoded:
var secret = Buffer.from('fe1a1915a379f3be5394b64d1479493223232', 'hex')



// var localhost=require("../node_proxy_last/config/config")
// var cookieSession = require('cookie-session')
const app = express();
app.set('trust proxy', 1) // trust first proxy
// app.use(cookieSession({
//     name: 'session',
//     keys: ['key1', 'key2'],
//     maxAge: 50 * 1000 // 10 seconds
// }))
// var proxyTable = {
//     "/demo" : "http://localhost/demo/",    // host only
//     "/app1"  : "http://localhost/app1.html",     // path only
//     "/app2"  : "http://localhost/app2.html",    // host + path
//     // "/new"  : "http://localhost:8000",    // host + path
// };



var customRouter = function (req) {
    var requ_res = hashTable.get('reso')
    console.log("custom router", requ_res);
    // return 'http://'+webserver.webserver+ '/' + "wordpress" +"/"
    return 'http://' + webserver.webserver + "/" + requ_res
    // +"/"  // protocol + host
};

// This is The Filter Based On Which The Proxy Will Either be done or not.
var filter = (pathname, req) => {
    //return (pathname.match('^/auth') && req.method === 'POST' && req.body.auth == '123');
    return (pathname.match('^/auth/*') && req.header("auth") != undefined && (req.method === 'GET' || req.method === 'POST'));
};
//applications
var authProxy = proxy(filter, {
    target: 'http://localhost/',
    router: customRouter,
    pathRewrite: {
        // '^/wordpress/*': '^/wordpress/*',

        // '^/demo/*': '',
        // '^/app1/*': '',
        // '^/app2/*': '',
        '^/auth/*': '',
    }
})
//target table
//rules
// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', authProxy);
// app.use('/demo', authProxy);


// Index Route
app.get('/:respo', (req, res) => {
    if (req.params.respo == "favicon.ico") { }
    else {
        var reso = (req.originalUrl)
        // var reso = req.params.respo
        // var reso = ("/app2.html")
        console.log(reso, "pura url");

        var data = reso.substring(1, 1000)
        console.log(data, "trim");

        // if (req.params.res != "favicon.ico")
        hashTable.set('reso', data)
        console.log(data, "ssssssssssssssssssssssssss");
        //========================Resource is public or protected ====================================
        var requ_res = hashTable.get('reso')
        login.checkResource(requ_res)
            .then((resp) => {
                console.log(resp, "response from resource get");
                if (resp == "Public") {
                    // res.send("public resource");
                    // ==================Resource is public ==================
                    request({ method: 'POST', url: 'http://localhost:3000/auth/', headers: { 'auth': true } }, (err, remoteResponse, remoteBody) => {
                        if (err) {
                            return res.send(err);
                        } else {
                            // req.session.views = (req.session.views || 0) + 1

                            return res.send(remoteBody);                        // }
                        }
                    })
                    // ==================Resource is public ==================


                }
                else if (resp == "Protected") {
                    var cookies = new Cookies(req, res, { keys: keys })
                    var cook = cookies.get('id_token', { signed: true })
                    console.log(cook, "get cookie in request");
                    //for protected and not authenticated, sends to sso page
                    //if authenticated go to the requested resource
                    if (cook == undefined || null) {
                        console.log("no cookie");
                        if (req.header("auth") == undefined) {
                            res.sendFile(path.join(__dirname + '/login.html'));
                        }
                        else {
                            res.send('Invalid Endpoint');
                        }
                    }
                    else {
                        var decoded = jwt.decode(cook, secret);
                        console.log(decoded);
                        var de = hashTable.get("payload")
                        if (de == decoded) {
                            // res.send("cookie found")
                            request({ method: 'POST', url: 'http://localhost:3000/auth/', headers: { 'auth': true } }, (err, remoteResponse, remoteBody) => {
                                if (err) {
                                    return res.send(err);
                                } else {
                                    // req.session.views = (req.session.views || 0) + 1

                                    return res.send(remoteBody);                        // }
                                }
                            })
                        } else {
                            res.clearCookie('id_token');
                            // res.send("cookie WRONG")
                        }
                    }
                }
                else {
                    res.send("No such resource found")
                }
                // hashTable.clear();
            })
            .catch((err) => err)










        //============================================================
        // if (req.header("auth") == undefined) {
        //     res.sendFile(path.join(__dirname + '/login.html'));
        // } else {
        //     res.send('Invalid Endpoint');
        // }
    }
});

app.get('/auth/*', (req, res) => {
    if (req.header("auth") == undefined) {
        res.sendFile(path.join(__dirname + '/login.html'));
    } else {
        res.send('Invalid Endpoint');
    }
});

app.post('/auth/*', (req, res) => {
    if (req.header("auth") == undefined) {
        res.sendFile(path.join(__dirname + '/login.html'));
        hashTable.clear()
    } else {
        res.send('Invalid Endpoint');
    }
});


app.post('/', (req_authentication, res_authentication) => {
    if ((req_authentication.body.username != null && req_authentication.body.username != undefined) &&
    (req_authentication.body.password != null && req_authentication.body.password != undefined) &&
    (req_authentication.body.username != '' && req_authentication.body.password != '')) {
        var cookieset = new Cookies(req_authentication, res_authentication, { keys: keys })            //cookie set
        cookieset.set('id_token', token, { maxAge: 60000, httpOnly: true }, { signed: true })  //uncomment 
        return   res_authentication.send("hello");
    }
})


var qr = require('qr-image');
var data = "omkar";
// generate qr code______________________________________________________
app.get('/post/generate', (req, res) => {
    console.log(data, "qr data readings");
    if (data == null) {
        res.send("QR data already present")
    }
    request({ method: 'POST', url: 'http://192.168.1.44:4000/api/scan', form: { username: data, qr_code: data } }, (err, res) => {
        if (err) {
            res.send(err);
        }
        console.log("Device registered");
    })
    var code = qr.image(data, { type: 'png', size: 10 });
    res.type('png');
    code.pipe(res);
    return res.send(res);

});



// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);

});
