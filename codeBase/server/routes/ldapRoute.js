const express = require('express');
const router = express.Router();
const ldap = require('ldapjs');
const ldap_config = require('./../models/LDAPSchema'); 


router.post('/Authenticate', (req, res, next) => {
    console.log(req.body);
    
    const client = ldap.createClient({
        url:req.body.url,
        // reconnect: true
    });

    client.on('error', function(err) {
        console.log('LDAP connection failed, but fear not, it will reconnect OK', err);
        if(err){
            res.json({success : false, msg : 'Invalid URL Given by you.'});
        }
    });

    client.bind(req.body.admin_uid_basedn, req.body.admin_password, function(err) {
        if(err) {
            res.json({success : false, msg : 'Invalid Credentials..!'});
        } else {
            res.json({success : true, msg : 'Connect Successfully..!'});
        }
    });

});


router.get('/', (req, res, next) => {

    ldap_config.find({}, (err, obj) => {
        if(err) res.json({success : false, msg : 'Invalid Data..!'});
        else {
            ldapfunction(res,obj);
        }
    });
});

function ldapfunction(res,object){
        
    const client = ldap.createClient({
        url:object[0].Url
    });
    
    client.on('error', function(err) {
        console.log('LDAP connection failed, but fear not, it will reconnect OK', err);
        if(err){
            res.json({success : false, msg : 'Invalid URL Given by you.'});
        }
    });

    // Filter for Fetching Data of User which is now fetch *.
    const opts = {
        filter: object[0].UserBase_Filter,
        scope:  object[0].UserSearch_Scope
    };

    client.bind(object[0].Admin_UID_BaseDN, object[0].Admin_Password_Attr, function(err) {
        if(err) res.json({success : false, msg : 'Invalid Credentials..!'});
        else {
            let arr = [];
            client.search(object[0].UserBase_DN, opts, function(error, abc) {
                if(err) console.log('Problem in Search..!');

                console.log('abc is ' + JSON.stringify(abc) + '\n');
                
                //Search all data 
                abc.on('searchEntry', function(entry){
                    arr.push(JSON.stringify(entry.object));
                });

                abc.on('end', function(result) {
                    res.json({success : true, msg : 'Connect Successfully..!', obj : arr});
                });


            });
        }
        
    });
}

module.exports = router;



// var promise1 = new Promise(function(resolve, reject) {
//     let arr = [];
//     client.search(object[0].UserBase_DN, opts, function(error, res) {
//         assert.ifError(error);
    
//         //Search all data 
//         res.on('searchEntry', function(entry) {
//         console.log('entry: ' + JSON.stringify(entry.object));
//         arr.push(JSON.stringify(entry.object));
//         });
//     });
//     resolve(arr);
// });
//   promise1.then(function(value) {
//     console.log(value);
//   });
