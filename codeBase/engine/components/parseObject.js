var hashTable = require("node-hashtable");

const App = require('../models/app_schema')
const User = require('../models/user_schema');

saveReqObj = function (reqObj) {
    return new Promise((resolve, reject) => {
        if (reqObj.username != (null || undefined) || reqObj.password != (null || undefined)) {
            hashTable.set('request', reqObj);
            hashTable.set('requestip', "255.255.255.255");
            hashTable.set('requesttime', "6.00");
            // var a = hashTable.get('request')
            // var b = hashTable.get('requestip')
            // var c = hashTable.get('requesttime')
            // console.log(a)
            // console.log(b);
            // console.log(c);
            
            

            App.findOne({ 'app_name': reqObj.resource[0].resource_id.split('/')[0] }, { '_id': 1 })
                .then(appid => {
                    if (appid == null) {
                        reject('Application name u provided does not exist !')
                    }
                    else { hashTable.set('appid', appid) }
                })
                .catch(err => console.log(err));
            User.findOne({ 'username': reqObj.username }, { 'role.role_id': 1, '_id': 0 }, (err, result) => {
                if (err) console.log(err)
                else if (result == null) {
                    reject('username not found in MongoDb')
                }
                else {
                    for (i = 0; i < result.role.length; i++) {
                        hashTable.add('roles', result.role[i].role_id)
                    }
                }
            })

                .then(() => resolve(reqObj))
        }
        else reject('faliure ! no username or password !')
    });
}

exports.setdata = saveReqObj;