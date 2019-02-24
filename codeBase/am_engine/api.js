var hashTable = require("node-hashtable");
const express = require('express');
const router = express.Router();
const Policy = require('./models/policy_schema');
const Resource = require('./models/resource_schema')
const Cookies = require('cookies')
//load component-activities
const activity2 = require('./components/authenticate');
const activity1 = require('./components/fetched_data');
;
const activity3 = require('./components/getPolicy');
const User = require('./models/user_schema')
const activity4 = require('./components/checkConstraints');
activity = require('./components/parse_object')
// let resObj = hashTable.get('resource')
// var cookies = new Cookies(req, res)





// var t = cookies.get('url')
// console.log(t, "2222222222222222")
// console.log(req,"bodybodybodybody")

//flow of the engine
router.post('/', (req, res) => {
    hashTable.set('remote_ip', req.ip);
    // var url = hashTable.get('url')
    // var auth = false
    // var auth = hashTable.get('auth')
    // if (auth == null || auth == "") {
    var url = req.body.url
    activity1.fetchData(url)
        .then((resObj) => {
            console.log(resObj, "................resource validation")
            activity2.authenticate(req.body.username, req.body.password)
                .then((obj) => {
                    // hashTable.set('auth', obj)
                    console.log(obj, "..............username and password validation")
                    //hashtable
                    activity3.fetchPolicy(obj)
                        .then((obj) => {
                            console.log(obj, ".............fetching privilege")
                            activity4.checkConstraints(obj)
                                .then((value) => {
                                    console.log(value, "....from checkConstraints")
                                    activity4.checkTargets(obj)
                                        .then((value) => {
                                            console.log(value, "....from checkTargets")
                                            res.send(value)
                                        })

                                        .catch((err) => res.status(500).json({ success: false, msg: 'No target access' }))
                                })
                                .catch((err) => res.status(500).json({ success: false, msg: 'No Constraints Match' }))
                        })
                        .catch((err) => res.status(500).json({ success: false, msg: 'No time match' }))
                })
                .catch((err) => res.status(500).json({ success: false, msg: 'Invalid Credentials' }))
        })
        .catch((err) => res.status(500).json({ success: false, msg: 'Invalid Resource' }))
})
// else {
//     var obj = hashTable.get('auth')
//     activity3.fetchPolicy(obj)
//         .then((privilege) => {
//             console.log(privilege, ".............fetching privilege 33333333333")
//             res.send("success")
//         })
//         .catch((err) => res.send(err))
// }
// }





//authenticate
router.get('/:authenticate', (req, res) => {
    console.log(req.params.authenticate, "lllllllllllllllllllllllllll0");

    activity2.authenticate(req.body.username, req.body.password)
        .then((obj) => {
            hashTable.set('authentication', obj)
            var h = hashTable.get('authentication')
            console.log(h, "..............authentication")
        });
});

//working validation for resource 
router.get('/validate_resource/:resource', (req, res) => {
    console.log(req.connection.remoteAddress.substring(7), "[][][][][][[][[][][]")
    hashTable.set('remote_ip', req.connection.remoteAddress.substring(7))
    activity.setdata({ url: req.params.resource }).then((respo) => {
        console.log(respo, "response");
        if (respo == "Public") {
            res.send(respo)
        } else if (respo == "Protected") {
            res.send(respo)
        }
        else {
            res.send("no such resource found")
        }
        hashTable.clear()
        //clear the hashtable for next request
    })
        .catch((err) =>
            res.status(500).json({ success: false, msg: 'Resource not Found' })

        )

});


//checking of authorization
// router.post('/authorize', (req, res) => {
//     var obj = req.body.access
//     activity3.fetchPolicy(obj)
//         .then((privilege) => {
//             console.log(privilege, ".............fetching privilege")
//             res.send("success")
//         })
//         .catch((err) => res.send(err))
// });

//multifactor && single factor
router.get('/auth_type/:authentication_type', (req, res) => {
    console.log(req.params.authentication_type, "authentication_type message.......");
    activity.getfactor(req.params.authentication_type)
        .then((a) => {
            console.log(a, "aaaaaaaaaaaaaa");
            res.send(a)
        })
        .catch((err) =>
            res.status(500).json({ success: false, msg: 'Resource not Found' })

        )
});







//QR_generator
//comes from web intercepter
router.post('/scan', (req, res) => {
    console.log(req.body, "qrqrqrqrqrqrqrq");
    User.findOne({ 'username': req.body.username },
        function (error, success) {
            if (success == null) {
                console.log(error);
                res.status(500).json({ success: false, msg: 'User not Found' })


            } else {

                // console.log(success.qr_code, "successssssssssssssss");
                // if (success.qr_code != null || success.qr_code != undefined) {
                //     res.send(false)
                //     console.log("error false");
                // } else {
                // stores qr to mongo
                User.updateOne({ 'username': req.body.username }, { $set: { "qr_code": req.body.qr_code } },
                    function (error, successupdate) {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ success: false, msg: 'User not Found' })
                        } else {
                            console.log(successupdate);
                            res.send(true)
                        }
                    });
            }
            // }
        });
});



// scans from mobile app
//will be searching with the help of device tokens and generated qr code
// scans from mobile app
router.get('/scan/:qr_generator', (req, res) => {
    //android or iphone
    console.log(req.params.qr_generator, "response after scan");
    var username = req.params.qr_generator
    // var devicetoken = "omkar"
    // store qr to mongo
    User.findOne({ 'username': username }, { 'qr_code': 1 }, (err, req) => {
        console.log(req, "pppppp")
        if (req.qr_code == username) {
            token_save(username).then((token) => {

                console.log(token, "token to be generated");
            })
            res.send("true")
        } else {
            // res.send("Device registration failed")
            // res.send("false")            //uncomment
            res.status(500).json({ success: false, msg: 'QR code does not match' })  //uncomment for testing only

        }
    })
})


//save token into database
//after qr code matches
var token_save = function (username) {
    return new Promise((resolve, reject) => {
        // router.get('/save_token/:devicetoken', (req, res) => {   //UNCOMMENT LINE ONLY DISABLED FOR TESTING
        //android or iphone
        // device_token=req.params.devicetoken                  //UNCOMMENT LINE ONLY DISABLED FOR TESTING
        device_token = "asdHJBSDABWQwbENMBWB"                     //COMMENT
        console.log(device_token, "response after scan in token fumction");
        // console.log("working");
        // console.log(username, req.params.devicetoken, "response after scan");
        // //    -------------------------- after scanning
        // store qr to mongo
        User.updateOne({ 'username': username }, { $set: { "device_ID": device_token } },
            function (error, success) {
                if (error) {
                    console.log("error");
                    reject("false")
                } else {
                    console.log(success, "databse entry for device_id");
                    resolve(true)
                }
            });
    })
    // })              //UNCOMMENT LINE ONLY DISABLED FOR TESTING

}






var matching = function () {
    return new Promise((resolve, reject) => {
        router.get('/verify_fingerprint/:match', (req, res) => {
            //android or iphone
            var match = req.params.match
            console.log(match, "helllooooooooooooooooooooooo");
            resolve(match)
        })
    })
}
//will check if the device is registered or not
//if registered will go for fingerprint authentication
router.get('/check_device_or_fingerprint/:username', (req, res) => {
    //android or iphone
    console.log(req.params.username, "username to check whether it contains device registration id");
    var a = req.params.username
    console.log(a, "username");
    // checks for device token present in mongo   User.findOne({ 'username': 'omkar' }, { 'qr_code': 1 }, (err, req) => {
    //    if(device_ID ==null){
    //        console.log("error in device id");
    //    }
    User.findOne({ 'username': a }, { 'device_ID': 1 },
        function (error, success) {
            if (success.device_ID == "" || success.device_ID == null || error) {
                console.log("goes for device registration");
                res.send("registration")
            }
            else {
                var dev_token = success.device_ID
                console.log(dev_token, "fingerprint authentication call");
                // //fetch the mongo for device token for the notification to be sent
                // notification.notification(dev_token);
                // //write fingerprint logic   
                // matching().then((match) => {
                //     console.log(match, "inside promice");
                //     if (match == "true") {
                //         res.send("fingerprint")
                //     } else if (match == "false") {
                //         res.send("denied")
                //     }
                // })
                res.send("fingerprint")

            }
        })
})
module.exports = router;
     // .then(() => {
                    // request({ method: 'POSt', uri: 'http://192.168.1.35:8000/access' }, (err, res) => {
                    //     if (err) {
                    //         res.send("No resource found");
                    //     }
                    //     else {
                    //         res.send("Welcome");

