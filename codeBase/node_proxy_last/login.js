var hashTable = require("node-hashtable");
const request = require('request');
//user send the url

function checkResource(data) {
    return new Promise((resolve, reject) => {
        sumit = data
        console.log(sumit, "MMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
        //kiam engine request
        request({ method: 'GET', uri: 'http://localhost:4000/api/validate_resource/' + sumit }, (err, response) => {
            if (err) {
                response.send(404);
            }
            else {
                var resp = response.body;
                console.log(resp + "///////////////////////////////");
                if (resp === "Public") {
                    // console.log("Public");
                    resolve(resp)
                }
                else if (resp === "Protected") {
                    resolve(resp)
                }
                else {
                    resolve(resp)
                }
                // hashTable.clear();

                // resolve('Some error occured')
            }
        })

    })
}
// checkResource("app2.html")






function checklogin(username, password, url) {
    return new Promise((resolve, reject) => {
        if ((username != null && username != undefined) &&
            (password != null && password != undefined) &&
            (username != '' && password != '')) {
            request({ method: 'POST', url: 'http://localhost:4000/api/', form: { username: username, password: password, url: url } }, (err, response) => {
                if (err) {
                    res.send(err);
                } else {
                    var status = response.body
                    console.log(status, "statusstatusstatusstatusstatusstatus")
                    if (status == "success") {
                        console.log("protected");
                        hashTable.set('res_auth', "protected")
                        var respo = hashTable.get('res_auth')
                        console.log(respo, "this is from data");
                        resolve(true)
                    } else {
                        console.log("Access Denied");
                        hashTable.set('res_auth', "Access Denied")
                        var respo = hashTable.get('res_auth')
                        console.log(respo, "this is from data in else");
                        resolve(false)
                    }
                }
            })
        } else {
            res.sendFile(path.join(__dirname + '/re_login.html'));
        }
    })
}


//singlefactor or multifactor
function auth_factor(data) {
    return new Promise((resolve, reject) => {
        auth_factory = data
        console.log(auth_factory, "MMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
        //kiam engine request
        request({ method: 'GET', uri: 'http://localhost:4000/api/auth_type/' + auth_factory }, (err, res) => {
            if (err) {
                // res.send(404);
            }
            else {
                var resp = res.body;
                console.log(resp + "///////////////////////////////");
                if (resp == "single") {         
                    console.log("Single factor if of auth of resource");
                    resolve("multiple")         //change to single as data is not entered
                    // resolve("single")        //enable if data is ready
                }
                else if (resp == "MultiFactor") {
                    console.log("else of auth of resource");
                    resolve("multiple")
                }

            }
        })

    })
}
// auth_factor("app2.html")
exports.auth_factor = auth_factor;
exports.checklogin = checklogin;
exports.checkResource = checkResource;
