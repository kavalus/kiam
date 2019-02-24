var hashTable = require("node-hashtable");
const Resource = require('../models/resource_schema')
const Policy = require('../models/policy_schema');

saveReqObj = function (reqObj) {
    return new Promise((resolve, reject) => {
        if (reqObj.url != (null || undefined)) {
            hashTable.set('request', reqObj);
            Resource.findOne({ 'url': reqObj.url.toString() }, { "application_id": 1, "Protection_type": 1, "Authentication_type": 1, "res_name": 1 }, (err, res) => {
                if (err) console.log("Resource")
                else if (res == null) {
                    reject('resource not found in MongoDb')
                }
            })
                .then(appid => {
                    if (appid == null) {
                        reject('Application name you provided does not exist !')
                    }
                    else {
                        hashTable.set('appid', appid)
                        var resObj = hashTable.get('appid')
                        Policy.find({ 'application_id': resObj.application_id, 'policy_scope': resObj.Protection_type }, (err, policyObj, res) => {
                            // console.log(policyObj,":getting while validating:::::::::::::::::::::::")
                            if (err) console.log(err)
                            else if (policyObj == null || policyObj[0].policy_type == "deny") {
                                reject('resource  not found /Access denied')
                            }
                            else {
                                for (let index = 0; index < policyObj.length; index++) {
                                    const element = policyObj[index];
                                    const data = element.policy_targets
                                    for (let index = 0; index < data.length; index++) {
                                        const element1 = data[index];

                                        if (element1.resource_id == resObj._id) {
                                            console.log("Resource exists");
                                            var resid = element1.resource_id
                                            console.log(resid);
                                            if (policyObj[0].policy_scope == "Public") {
                                                // hashTable.set('res_of_type', "Public")
                                                console.log("public");
                                                resolve("Public")
                                                // res.send("Public Resource is Available and redirected to apache ");
                                            } else {
                                                // hashTable.set('res_of_type', "Protected")
                                                console.log("Protected");
                                                resolve("Protected")
                                            }
                                        }
                                        // else {
                                        //     console.error("Resource does not used in any Policy");
                                        // }
                                    }
                                }
                            }
                        });
                    }
                })
                // resolve(true)
                // .then(() => resolve(reqObj))
                .catch(err => console.log(err));
        }
        else reject('Resource not found !')
    });
}

//singlefactor or multi factored
getfactor = function (res_obj) {
    return new Promise((resolve, reject) => {
        Resource.findOne({ 'url': res_obj }, { "application_id": 1, "Protection_type": 1, "Authentication_type": 1, "res_name": 1 }, (err, res) => {
            if (err) console.log("Resource error")
            else if (res == null) {
                reject('resource not found in MongoDb')
            }
            else {
                // hashTable.set('resource_found', res);
                if (res.Authentication_type == "single") {
                    resolve("single")
                } else {
                    resolve("multiple")
                }
                // console.log(res+"sssssssssssssssssssssssssssssssssssssssssssss");
            }
        })

    });
}





exports.getfactor = getfactor;

exports.setdata = saveReqObj;
// var a= saveReqObj({url:"app2.html"})
// console.log(a,"hello");