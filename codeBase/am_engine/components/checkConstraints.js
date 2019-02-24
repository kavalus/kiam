var hashTable = require("node-hashtable");
const Policy = require('../models/policy_schema');
const Resource = require('../models/resource_schema')

const evaluatePolicy = require('./evaluatePolicy')
const identifyingAttributes = require('./identifyingAttributes')




checkConstraints = function checkConstraints(policyObj) {
    var resObj = hashTable.get('resObj');
    return new Promise((resolve, reject) => {
        if (policyObj != null) {
            if (policyObj.policy_constrains != null) {
                // console.log(policyObj.policy_constrains, "uuuuuuuuuuuuuuuuuuuuuuuuuu")
                identifyingAttributes.getPolicyConstraintAttributes(policyObj.policy_constrains, resObj.res_name).then((value) => {
                   console.log(value,"dceeeeeeeeeeeeeeee")
                    if ( value == true) {
                        console.log(value, "........constraints access")
                        resolve(value)
                    }
                    else reject(" no constraints")
                })
            } else reject(" no constraints")
        }
    })
}

checkTargets = function checkTargets(policyObj) {
    return new Promise((resolve, reject) => {
        if (policyObj.policy_targets[0].resourceType_actions != null) {
            const data = policyObj.policy_targets[0].resourceType_actions
            for (let index = 0; index < data.length; index++) {
                const element = policyObj.policy_targets[0].resourceType_actions[index].action_state;
                console.log(element, ".........Target Access")
                if (element == false) {
                    console.log("Access denied ");
                    reject("Action State does not have privilege")
                } else {
                    console.log("Access granted");
                    // return true
                    resolve(true)
                }
            }

        }
    })
}

exports.checkTargets = checkTargets;

exports.checkConstraints = checkConstraints;






