var hashTable = require("node-hashtable");
const express = require('express');
const router = express.Router();

//load component-activities
const activity1 = require('../components/parseObject');
const activity2 = require('../components/authenticateUser');
const activity3 = require('../components/getFinalPolicy');
const activity4 = require('../components/finalObject');
const activity5 = require('../components/parse_object');


router.post('/', (req, res) => {
    activity1.setdata(req.body)
        .then((obj) => {
            activity2.authenticate(obj.username, obj.password)
                .then(() => {
                    activity3.getPolicies(obj)                   
                        .then(() => {
                            activity4.generateObject(obj)
                                .then((finalObject) => {
                                    res.send(finalObject);
                                })
                        })
                        .catch((err)=>res.send(err))
                })
                .catch((err)=>res.send('username and pass does not match !' + err ))
         })
         .catch((err)=>res.send(err))
});

module.exports = router;