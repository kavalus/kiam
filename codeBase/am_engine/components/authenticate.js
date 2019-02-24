const User = require('../models/user_schema');
const ldap = require('ldapjs');
const LDAPSchema = require('./../models/LDAPSchema');
// var hashTable = require("node-hashtable");
var hashTable = require("node-hashtable");

const config = require('./../config/database');

let LDAPData = {};

authenticate = function (username,password) {
     console.log(username,password,"11111111111 ")

    
    return new Promise((resolveAuth, rejectAuth) => {
        //Find User from MongoDB if not found Reject Request else Authenticate User
        User.findOne({ username:username }, (err, user) => {
            if (err) {
                console.log({ Login: false, Error: true });
                rejectAuth(false);
            } else if (user) {
                User.comparePassword(password, user.password, (err, isMatch) => {
                    if(err) {
                        console.log({Login : false, Error : true});
                        rejectAuth(false);
                    }
                    if (isMatch) {
                        console.log({ Login: true, Error: false });
                        console.log('user available')
                    
                        hashTable.set('username',username)
                        resolveAuth(true,"from authentication---1");
                        // User.findOne({'username':username},{'role.role_id':1,'_id':0},(err,result)=>{
                        //     if(err) console.log(err)
                        //     else if(result == null ){
                        //         reject('username not found in MongoDb')
                        //     console.log(username,"vvvvvvvvvvv")
                        //     }
                        //     else{
                        //         for(i=0;i<result.role.length;i++){
                        //             hashTable.add('roles',result.role[i].role_id)
                        //         }   
                        //     }
                        // })
                    } else {
                        console.log({ Login: false, Error: false });
                        return new Promise((resolve, reject) => {
                            LDAPSchema.find({}, (err, data) => {
                                if (err) console.log(err);
                                else if (data.length != 0) {
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
                            let dn = "cn=" + username + ',' + LDAPData.UserBase_DN;
                            client.bind(dn, password, (err) => {
                                if (err) {
                                    console.log('LDAP Authentication : ' + JSON.stringify({ Login: false, Error: 'Invalid UserName & Password.' }));
                                } else {
                                    console.log('LDAP Authentication : ' + JSON.stringify({ Login: true, Error: null }));
                                    User.UpdateUser(username, password, (err, user) => {
                                        if (err) {
                                            console.log({ Login: false, Error: true });
                                            rejectAuth(false);
                                        } else {
                                            console.log({ Login: true, Error: false });
                                            console.log('Password Changed Successfully..!');

                                            resolveAuth(true,"from authentication---2");
                                        }
                                    });
                                }
                           
                            });
                        })
                            .catch(() => {
                                rejectAuth(false)
                            })
                    }
            
                });
            } else {
                console.log({ Login: false, Error: 'User Not Exist.' });
                rejectAuth(false);
            }
        });
    });
}

exports.authenticate = authenticate ;
// console.log(authenticate('admin', 'admin123'));

//  authenticate('admin','admin123');

// resolve(true);
// reject(false);