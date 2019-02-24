const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const proxy = require('http-proxy-middleware');
const request = require('request');
var hashTable = require("node-hashtable");
const login = require('./login')

var cookieSession = require('cookie-session')
const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 50 * 1000 // 10 seconds
}))


// This is The Filter Based On Which The Proxy Will Either be done or not.
var filter = (pathname, req) => {
    //return (pathname.match('^/auth') && req.method === 'POST' && req.body.auth == '123');
    return (pathname.match('^/auth/*') && req.header("auth") != undefined && (req.method === 'GET' || req.method === 'POST'));
};
//applications
var requested_resource = "http://localhost/demo/"
var authProxy = proxy(filter, { target: requested_resource, pathRewrite: { '^/auth/*': '', '^/demo/*': '' } });
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
app.get('/:res', (req, res) => {
    if (req.params.res != "favicon.ico")
        hashTable.set('reso', req.params.res)
    console.log(req.params.res, "ssssssssssssssssssssssssss");
    //========================Resource is public or protected ====================================
    var requ_res = hashTable.get('reso')
    login.checkResource(requ_res)
        .then((resp) => {
            console.log(resp, "response from resource get");
            if (resp == "Public") {
                res.send("public resource");
            }
            else if(resp == "Protected") {
                //for protected and not authenticated, sends to sso page
                if (req.header("auth") == undefined) {
                    res.sendFile(path.join(__dirname + '/login.html'));
                } else {
                    res.send('Invalid Endpoint');
                } 
            }
            else{
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
        } else {
            res.send('Invalid Endpoint');
        }
    });

    app.post('/demo/*', (req, res) => {

        if ((req.body.username != null && req.body.username != undefined) &&
            (req.body.password != null && req.body.password != undefined) &&
            (req.body.username != '' && req.body.password != '')) {

            // The Logic For Getting Authorization Based On Username Password Passed will come Here
            //if authentication == true
            // This Authorization Key Value Pair will then be added to headers Below
            // For Now it Has Been Hardcoded for Demonstration
            var url = hashTable.get('reso')
            console.log(url, "which we got it from get hash");

            login.checklogin(req.body.username, req.body.password, url).then((data) => {
                console.log(data, "In login api");
                if (data != true) {
                    res.sendFile(path.join(__dirname + '/login.html'));
                }
                else
                    // req.session.views = (req.session.views || 0) + 1
                    // var access=req.session.views
                    // if (access==0) {
                    // 	auth="notauthenticated"
                    // 	hashTable.set('auth', auth)

                    // } else {
                    // 	auth="auth"
                    // 	hashTable.set('auth', auth)

                    // }
                    // var access=hashTable.get('auth')
                    request({ method: 'POST', url: 'http://localhost:3000/auth/', headers: { 'auth': true } }, (err, remoteResponse, remoteBody) => {
                        if (err) {
                            return res.send(err);
                        } else {
                            // if (req.session.views == undefined || 0) {
                            res.sendFile(path.join(__dirname + '/login.html'));
                            // }
                            // else {
                            return res.send(remoteBody);
                            // }
                        }
                    })

            })		//then close for check login			
        } else {
            res.sendFile(path.join(__dirname + '/re_login.html'));
        }
        

    })


    // Start Server
    app.listen(port, () => {
        console.log('Server started on port ' + port);

    });

    // app.listen(3001, () => {
    //     console.log('Server started on port ' + 3001);
    // });
