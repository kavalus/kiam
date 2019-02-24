var hashTable = require("node-hashtable");
const Resource = require('../models/resource_schema')
const Policy = require('../models/policy_schema');

saveReqObj = function (reqObj) {
    return new Promise((resolve, reject) => {
        if (reqObj.url != (null || undefined)) {
            hashTable.set('request', reqObj);
            Resource.findOne({ 'url': reqObj.url.toString() }, { "application_id": 1, "Protection_type": 1, "Authentication_type": 1, "res_name":1 }, (err, res) => {
                if (err) console.log("Resource")
                else if (res == null) {
                    reject('resource not found in MongoDb')
                }
                else{
                    // console.log(res);
                    console.log(reqObj.username,"aaaaaaaaaaaaaaaaaaaaaaaa");
                    
                }
            })
                .then(appid => {
                    if (appid == null) {
                        reject('Application name you provided does not exist !')
                    }
                    else { hashTable.set('appid', appid) }
                    
                    var resObj = hashTable.get('appid')
                    console.log(resObj,"requested resource");
                    Policy.find({ 'application_id': resObj.application_id, 'policy_scope': resObj.Protection_type }, (err, policyObj,res) => {
                        // console.log(policyObj,"::::::::::::::::::::::::")
                        if (err) console.log(err)
                        else if (policyObj == null) {
                            reject('resource  not found in MongoDb')
                        }
                        else {
                            for (let index = 0; index < policyObj.length; index++) {
                                const element = policyObj[index];
                                const data = element.policy_targets
                                for (let index = 0; index < data.length; index++) {
                                    const element1 = data[index];

                                    //verified if the resource is public or protected
                                    if (element1.resource_id == resObj._id) {
                                        console.log("Resource exists");
                                        var resid = element1.resource_id
                                         console.log(resid);
                                        if (policyObj[0].policy_scope == "Public") {
                                            hashTable.set('res_of_type', "Public")
                                            console.log("public");
                                            // res.send("Public Resource is Available and redirected to apache ");
                                        } else {
                                            hashTable.set('res_of_type', "Protected")
                                            console.log("Protected");
                                        }
                                    } else {
                                        console.error("Resource does not used in any Policy");
                                    }
                                }
                            }
                        }
                    });
                })
                // resolve(true)
                .then(() => resolve(reqObj))
                // .catch(err => console.log(err));
        }
        else reject('Resource not found !')
    });
}
// console.log(saveReqObj({url:"www.public.com"}));
exports.setdata = saveReqObj;
// saveReqObj({url:"www.protected.com",
// username:"admin",password:"admin123"})  