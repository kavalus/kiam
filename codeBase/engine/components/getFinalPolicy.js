const IdentifyingAttributes = require('./identifyingAttributes');
const Policy = require('../models/policy_schema');

const Fuse = require('fuse.js')
var hashTable = require('node-hashtable');

async function findpolicy(username,roles,appid,resname,action){
    let policy = await (           
        Policy.findOne({
            'policy_type'       : 'grant',
            'application_id'    : appid,
            'policy_targets'    : { $elemMatch: {'resource_name': resname } },

            //,'policy_targets'    : { $elemMatch: {'resourceType_actions': { $elemMatch: {'action_name': action}}}}
        },
            {'policy_constrains': 1, 'policy_targets.$.resourceType_actions' : 1 , '_id' : 0 },   
        )
        .where({ $or : [ { 'policy_principals.name' : username } , { 'policy_principals.id' : { $in : roles} } ] } , (err,response) => {
            if(err) console.log(err);
            else{
                console.log(response);
                
            }
        })
    //     .where({'policy_targets'    : { $elemMatch: {'resourceType_actions': { $elemMatch: {'action_name': obj.resource[i].action}}}}})
    //     .then(policy => {
    //         if (policy == null ) reject('no policy found from given data !')
    //         else{
    //             console.log('\x1b[36m%s\x1b[0m',policy);
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    )
    return policy; 
    
}


getPolicies = function (obj) {
    return new Promise(async (resolve, reject) => {
        for (var i = 0; i < obj.resource.length ; i++) {
            
            var appid = hashTable.get('appid');
            var roles = hashTable.get('roles');
            var resname = obj.resource[i].resource_id.split('/')[2];
            var action = obj.resource[i].action;
            var policy = await (findpolicy(obj.username,roles,appid._id,resname,action))           
                if (policy == null ) hashTable.add('privilege', "false, as no such policy was found for the given data"); //reject('no policy found from given data !')
                else{
                    if ( await (IdentifyingAttributes.getPolicyConstraintAttributes(policy.policy_constrains,resname)) ){

                        var options = { keys: ['action_name'] }
    
                        var fuse = new Fuse(policy.policy_targets[0].resourceType_actions , options)
                        var action_obj = fuse.search(action);
                        console.log('\x1b[31m%s\x1b[0m',action_obj);
                        hashTable.add('privilege', action_obj[0].action_state)
                        console.log('\x1b[35m%s\x1b[0m', action_obj[0].action_state );
                    }
                    
                    else{
                        hashTable.add('privilege', false);
                        console.log('in else condition');
                    }
                }
    
                if(i+1 === obj.resource.length){
                    setTimeout(() => {
                        resolve('ok')
                    }, 0); 
                }

            }
    })
}

exports.getPolicies = getPolicies;
