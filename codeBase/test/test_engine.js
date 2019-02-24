const request = require('supertest');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:4300/api';
chai.use(chaiHttp);

describe('Engine Test', function () {
    this.timeout(5000);
    //Testing engine with 1 resource and 1 action
    it('When data is Valid for 1 resource and 1 action  without Constraints', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "admin",
                "password": "admin123",
                "role": "Manager",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product/Levis",
                        "action": "PUT"
                    }
                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false) console.log("Privilege not Verified");

                    expect(res.statusCode).to.equal(200);
                    done();
                } else {
                    assert.fail("Invalid Credentials.");
                    console.log(err);
                }
            });
    });

    it('When data is Valid for 1 resource and 1 action with Constraints ', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "amunshi",
                "password": "admin123",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product/Apple",
                        "action": "PUT"
                    }
                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false)console.log("Privilege not Verified");
                   
                    expect(res.statusCode).to.equal(200);
                    done();

                } else {
                    assert.fail("Invalid Credentials.");
                    console.log(err);
                }
            });
    });

    it('Testing engine 1 resource and multiple actions without constraints', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "omkar",
                "password": "admin123",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product Category/Electronics",
                        "action": "buy"
                    },
                    {
                        "resource_id": "Shopping App/Product Category/Electronics",
                        "action": "sell"
                    }
                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false)console.log("Privilege not Verified");
                    expect(res.statusCode).to.equal(200);
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
    });


     // // Testing engine with 1 resource and multiple action
     it('Testing engine 1 resource and multiple actions with constraints', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "admin",
                "password": "admin123",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product Category/Clothing",
                        "action": "buy"
                    },
                    {
                        "resource_id": "Shopping App/Product Category/Clothing",
                        "action": "sell"
                    }
                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);

                    if (pri_value == false)console.log("Privilege not Verified");
                    expect(res.statusCode).to.equal(200);
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
    });

    // // Testing engine with multiple resource and multiple action
    it('Testing engine multiple resource and multiple actions without constraints', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "rahul",
                "password": "admin123",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product Category/Electronics",
                        "action": "buy"
                    },
                    {
                        "resource_id": "Shopping App/Product Category/Electronics",
                        "action": "sell"
                    },
                    {
                        "resource_id": "Shopping App/Product/Apple",
                        "action": "PUT"
                    }

                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    expect(res.statusCode).to.equal(200);
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false)console.log("Privilege not Verified");
                   
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
    });

     // // // Testing engine with multiple resource and multiple action
     it('Testing engine multiple resource and multiple actions with constraints', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "abhi",
                "password": "admin123",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product Category/Clothing",
                        "action": "buy"
                    },
                    {
                        "resource_id": "Shopping App/Product Category/Clothing",
                        "action": "sell"
                    },
                    {
                        "resource_id": "Shopping App/Product/Levis",
                        "action": "PUT"
                    }

                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false)
                    // console.log("Privilege not Verified");
                    expect(res.statusCode).to.equal(200);
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
    });



       // // // Testing engine with multiple Constraints and dynamic attributes from Request Object
       it('Testing engine with multiple Constraints and dynamic attributes from Request Object', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "laxmikant",
                "password": "admin123",
                "Fast_moving":true,
                "resource": [
                    {
                        "resource_id": "Shopping App/Product/Pepe",
                        "action": "PUT"
                    }
                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false)
                    // console.log(" Privilege not Verified");
                    expect(res.statusCode).to.equal(200);
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
    });


 

    // // // Testing engine with multiple Constraints and dynamic attributes from PIP
    it('Testing engine with multiple Constraints and dynamic attributes from PIP', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "laxmikant",
                "password": "admin123",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product/Pepe",
                        "action": "PUT"
                    }
                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false)
                    // console.log(" Privilege not Verified");
                    expect(res.statusCode).to.equal(200);
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
    });

    it('Testing engine for Resource return Functionality', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "amunshi",
                "password": "admin123",
                "resource": [
                    {
                        "resource_id": "Shopping App/Product/Apple",
                        "action": "PUT",
                        "resource_return_attributes": [
                            "Min_discount" 
                            ]
                    }
                ]
            })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].resource_return_attributes;
                    var res=(pri_value[0].Min_discount);
                    // console.log(res);
                    if(res != 5) console.log("Resource not returned");
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
        });

   
    // // // Testing engine for LDAP Functionality
    it('Testing engine for LDAP Functionality', function (done) {
        chai.request(url)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
                "username": "sumit",
                "password": "admin123",
                "resource": [
                  {
                    "resource_id": "Shopping App/Product/Apple",
                    "action": "PUT"
                  }
                ]})
            .end((err, res) => {
                if (res.statusCode == 200) {
                    var ress = res.body.resource;
                    var pri_value = ress[0].privilege;
                    // console.log(pri_value);
                    if (pri_value == false)console.log("Privilege not Verified");
                    expect(res.statusCode).to.equal(200);
                    done();
                } else {
                    assert.fail("Engine not working.");
                    console.log(err);
                }
            });
    });
   

});

