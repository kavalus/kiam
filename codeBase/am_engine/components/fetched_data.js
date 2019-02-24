var hashTable = require("node-hashtable");
const Resource = require('../models/resource_schema')
const Policy = require('../models/policy_schema');
const User = require('../models/user_schema');
var range = require('./check_Range')
// var checkIpaddrInRange = range.checkIpaddrInRange()
var fetched_Data = function (reqObj) {
    // var reso = hashTable.get("url");
    // console.log(reqObj, "2222222222222222")
    return new Promise((resolve, reject) => {
        if (reqObj != (null || undefined)) {
            Resource.findOne({ 'url': reqObj.toString() }, { "application_id": 1, "Protection_type": 1, "authorization_type": 1, "res_name": 1, "attributes": 1 })
                .then(res => {
                    console.log(res, "hhhhhhhhhhhhhhhhhhhh")
                    if (res == null) {
                        reject('Application name u provided does not exist !')
                    }
                    else {
                        hashTable.set('resObj', res)

                        var resObj = hashTable.get('resObj')
                    }
                })
                .then(() => resolve(true))
        }
        else reject('Resource not found !')
            .catch(() => console.err(err))
    });
}
// console.log(saveReqObj({url:"www.public.com"}));
exports.fetchData = fetched_Data;
// exports.resObj= resObj;
//   saveReqObj({url:"www.public.com"})

                    // var roles = hashTable.get('roles');
                    // Policy.findOne({
                    //     'policy_type': 'grant',
                    //     'application_id': resObj.application_id,
                    //     'policy_scope':resObj.Protection_type,
                    //     'auth_ip_start': '255.255.255.230',
                    //     'policy_principals.name' : reqObj.username} , 
                    //         (err, policyObj, res) => {
                    //         console.log(policyObj, "::::::::::::::::::::::::")
                    //         if (err) console.log(err)
                    //         else if (policyObj == null) {
                    //             reject('resource  not found in MongoDb')
                    //         }
                    //         else {

                    //         }
                    //     })
         // User.findOne({ 'username': reqObj.username }, { 'role.role_id': 1, '_id': 0 }, (err, result) => {
                    //     console.log(result, "eeeeeeeeeeeeeeeeeeeeeeeeeee")
                    //     if (err) console.log(err)
                    //     else if (result == null) {
                    //         reject('username not found in MongoDb')
                    //     }
                    //     else {
                    //         for (i = 0; i < result.role.length; i++) {
                    //             hashTable.set('roles', result.role[i].role_id)
                    //         }
                    //     }
                    // })


            // console.log(res, "<><><><><><><><><>")
            // return resObj;




            // resolve(true)

            //  .then(()=>{
            //     let resObj = hashTable.get('resource')
            //     console.log(resObj, "<<<<<<<<<<<<<<<<")

            //      resolve(resObj)
            //      return resObj;
            //   } )