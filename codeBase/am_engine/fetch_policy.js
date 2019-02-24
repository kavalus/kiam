const express = require('express');

var bcrypt = require('bcrypt-nodejs');
const router = express.Router();

const Resource = require('./models/resource_schema');
const Policy = require('./models/policy_schema')
var hashTable = require("node-hashtable");
var api= require('./api');





// var data=api.hashValue;
// console.log(data,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")




router.get('/Policy/fetchByAppId/:app_id', (req, res, next) => {
    Policy.find({ application_id: App_id, policy_scope: "Protected" }, (err, app) => {
        if (err) { res.json(err); }
        else {
            res.json(app);
            console.log(app, "oooooooooooooooooooooooooooooooooooo")
            if (app.policy_scope != "Protected") {
                // resource is not availabe 
            }
            else {
                //there could be a function, to determine the Authentication, as in resource.
                //redirect to SSO Page, based upon the authentication scheme in the resource.
                res.redirect('/Userlogin');
            }
        }
    });

});
module.exports = router;
