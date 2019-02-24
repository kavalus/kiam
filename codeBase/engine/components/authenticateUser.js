var hashTable = require("node-hashtable");

const mongoose = require('mongoose');
const User = require('../models/user_schema');
const ldap = require('ldapjs');
const LDAPSchema = require('./../models/LDAPSchema');

const config = require('./../config/database');

let LDAPData = {};

authenticate = function(username, password){
    return new Promise((resolveAuth,rejectAuth) => {
        //Find User from MongoDB if not found Reject Request else Authenticate User
    User.findOne({ username : username }, (err, user) => {
        if(err){
            console.log({Login : false, Error : true});
            rejectAuth(false);
        }else if(user){
            User.comparePassword(password, user.password, (err, isMatch) => {
                // if(err) {
                //     console.log({Login : false, Error : true});
                //     rejectAuth(false);
                // }
                if(isMatch) {
                    console.log({Login : true, Error : false});
                    // var resObj = hashTable.set('appid',user.username)
                    // console.log(resObj+"authenticate user");

                    resolveAuth(true); 
                } else {
                    console.log({Login : false, Error : false});
                    return new Promise((resolve,reject) => {
                        LDAPSchema.find({},(err, data) => {
                            if(err) console.log(err);
                            else if (data.length != 0){
                                LDAPData = data[0];
                                resolve('success !');
                            } else {
                                console.log('There is no Server Added..!');
                                rejectAuth(' LDAP Server not configured !')                   
                            }
                        });
                    }).then(() => {
                        const client = ldap.createClient({
                            url: LDAPData.Url
                        });
                        client.on('error', () => {
                            rejectAuth(false); 
                        });
                        const opts = {
                            filter: LDAPData.UserBase_Filter,
                            scope: LDAPData.UserSearch_Scope
                        };    
                        let dn ="cn="+ username + ',' + LDAPData.UserBase_DN;
                           client.bind(dn, password, (err) => {
                            if(err) {
                                console.log('LDAP Authentication : ' + JSON.stringify({Login: false, Error: 'Invalid UserName & Password.'}));
                            } else {
                                console.log('LDAP Authentication : ' + JSON.stringify({Login: true, Error: null}));
                                User.UpdateUser(username, password, (err, user) => {
                                    if(err) {
                                        console.log({Login : false, Error : true});
                                        rejectAuth(false);
                                    } else {
                                        console.log({Login : true, Error : false});
                                        console.log('Password Changed Successfully..!');
                                        
                                        resolveAuth(true);
                                                                        }
                                });
                            }
                        });
                    })
                    .catch(()=>{
                        rejectAuth(false)
                    })
                }
              });
        } else {
            console.log({Login : false, Error : 'User Not Exist.'});
            rejectAuth(false);
        }
    });
    });
}

exports.authenticate = authenticate ;

// authenticate('admin','admin123');

// resolve(true);
// reject(false);