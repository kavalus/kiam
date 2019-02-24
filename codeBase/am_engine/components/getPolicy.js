var hashTable = require("node-hashtable");
const Policy = require('../models/policy_schema');
const Resource = require('../models/resource_schema')
var Obj = require('./fetched_data');
var range = require('./check_Range')
const evaluatePolicy = require('./evaluatePolicy')
const identifyingAttributes = require('./identifyingAttributes')
var date = new Date;
var hour = date.getHours();
var minutes = date.getMinutes()
if (minutes < 10) {
    minutes = "0" + minutes
}
var current_time = hour + ":" + minutes
console.log(current_time, "time time time")

var Time = range.put_time;
//  var resObj = hashTable.get('appid')
var resource_obj = hashTable.get('resource')
var findpolicy = function () {
    return new Promise((resolve, reject) => {

        var resObj = hashTable.get('resObj')
        var username = hashTable.get('username')
        var remote_ip = hashTable.get('remote_ip')
        Policy.findOne({
            'policy_type': 'grant',
            'application_id': resObj.application_id,
            'policy_scope': resObj.Protection_type,
            // 'auth_ip_start': '255.255.255.230',//remote_ip
            'policy_principals.name': username,
            'policy_targets': { $elemMatch: { 'resource_name': resObj.res_name } }},
        
        (err, policyObj, res) => {




                if (policyObj != null) {
                    hashTable.set('policyObj', policyObj)
                    // console.log(policyObj.policy_constrains, "uuuuuuuuuuuuuuuuuuuuuuuuuu")
                    hashTable.set('ip_auth', range_auth_ip)




                    //When ip and time authorization both are not present
                    if (policyObj.auth_ip == false && policyObj.auth_time == false) {
                        resolve(policyObj)
                    }
                    //When only ip authorization present
                    else if (policyObj.auth_ip == true && policyObj.auth_time == false) {
                        var range_auth_ip = range.check_IP("255.255.255.245", policyObj.auth_ip_start, policyObj.auth_ip_end)
                        if (range_auth_ip == true) {
                            resolve(policyObj)
                        } else reject('Ip does not match')
                    }
                    //When only time authorization present
                    else if (policyObj.auth_ip == false && policyObj.auth_time == true) {
                        var range_auth_time = range.check_TIME(policyObj.auth_time_start, policyObj.auth_time_end, current_time)
                        if (range_auth_time == true) {
                            resolve(policyObj)
                        } else reject(' Time does not match')
                    }
                    //When both ip and time authorization are present
                    else if (policyObj.auth_ip == true && policyObj.auth_time == true) {
                        console.log(" TIME and IP is present");
                        var range_auth_time = range.check_TIME(policyObj.auth_time_start, policyObj.auth_time_end, current_time)
                        console.log(range_auth_time, "Time is in range")
                        var range_auth_ip = range.check_IP("255.255.255.245", policyObj.auth_ip_start, policyObj.auth_ip_end)
                        if (range_auth_ip == true && range_auth_time == true) {
                            resolve(policyObj)
                        } else reject('Ip and Time  not in range match')
                    }
                }
             
                else reject("error dude..!!")

            });
            
        // resolve(constraint)

    });
    // })
}
exports.fetchPolicy = findpolicy
