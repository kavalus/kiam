const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:4000/api/';
var public = "app1.html"
var protected = "app2.html"
var invalid = "invalid.html"
var multiple = "faq.html"

chai.use(chaiHttp);
describe('Access management Engine Test', function () {
    this.timeout(15000);
    describe('Validate Resource', function () {
        it('When resource is valid as public resource', function (done) {
            chai.request(url)
                .get('validate_resource/' + public)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for resource is not Valid!");
                    }
                });
        });
        it('When resource is valid as protected resource', function (done) {
            chai.request(url)
                .get('validate_resource/' + protected)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for resource is not Valid!");
                    }
                });
        });
        it('When resource is not valid', function (done) {
            chai.request(url)
                .get('validate_resource/' + invalid)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
    });

    describe('Authentication scheme', function () {
        it('When authentication scheme is set as single Factor', function (done) {
            chai.request(url)
                .get('auth_type/' + protected)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
        it('When authentication scheme is set as Multi Factor', function (done) {
            chai.request(url)
                .get('auth_type/' + multiple)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
        it('When invalid resource is checked for Authentication type', function (done) {
            chai.request(url)
                .get('validate_resource/' + invalid)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
    });


    describe('QR Code Generator', function () {
        it('When generate button is clicked for QR Code generator', function (done) {
            chai.request(url)
                .post('scan')
                .set('Content-Type', 'application/json')
                .send({
                    username: "sumit",
                    qr_code: "sumit"
                })
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for QR code generation is Invalid!");
                    }
                });
        });
        it('When there is error in generating QR Code', function (done) {
            chai.request(url)
                .post('scan')
                .set('Content-Type', 'application/json')
                .send({
                    username: "sumits",
                    qr_code: "sumitsa"
                })
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("Test for QR code generation is Valid!");
                    }
                });
        });
    });
    describe('QR Code Validator', function () {
        it('When Mobile app scans the QR code, verify and store token', function (done) {
            chai.request(url)
                .get('scan/' + "sumit")
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
        it('When token is not stored successfully after scanning QR Code', function (done) {
            chai.request(url)
                .get('scan/' + "amish")
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
    });

    describe('Device Registration/ Fingerprint authentication', function () {
        it('When device is not registered, calls for device authentication', function (done) {
            chai.request(url)
                .get('check_device_or_fingerprint/' + "sumit")
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
        it('When device is not registered, calls for fingerprint authentication', function (done) {
            chai.request(url)
                .get('check_device_or_fingerprint/' + "amish")
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    // console.log(res.body);
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Test for resource is Valid!");
                    }
                });
        });
    });



    //------------------------privilege
    describe('When Resource and credentials are valid', function () {
        this.timeout(2000);
        it('When Resource and credentials are valid', function (done) {
            chai.request(url)
                .post('')
                .set('Content-Type', 'application/json')
                .send({ username: "sumit", password: "admin123", url: "app2.html" })
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        // console.log(res.body);
                        done();
                    } else {
                        assert.fail("When Resource and credentials are Invalid");
                    }
                });
        });

        it('When Resource is Invalid & credentials are valid ', function (done) {
            chai.request(url)
                .post('')
                .set('Content-Type', 'application/json')
                .send({ username: "sumit", password: "admin123", url: "app.html" })
                .end((err, res) => {
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("When Resource is valid & credentials are valid ");
                    }
                });
        });
        it('When Resource is valid & credentials are Invalid (Username)', function (done) {
            chai.request(url)
                .post('')
                .set('Content-Type', 'application/json')
                .send({ username: "sumi", password: "admin123", url: "app2.html" })
                .end((err, res) => {
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("When Resource is valid & credentials are valid ");
                    }
                });
        });
        it('When Resource is valid & credentials are Invalid (Password)', function (done) {
            chai.request(url)
                .post('')
                .set('Content-Type', 'application/json')
                .send({ username: "sumit", password: "admin12", url: "app2.html" })
                .end((err, res) => {
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("When Resource is valid & credentials are valid ");
                    }
                });
        }
        );
    });
    describe('Authorization Test......', function () {
        this.timeout(2000);
        it('When time is Valid', function (done) {
            chai.request(url)
                .post('')
                .set('Content-Type', 'application/json')
                .send({ username: "pinank", password: "admin123", url: "app3.html" })
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        // console.log(res.body);
                        done();
                    } else {
                        assert.fail("When TIME is Invalid");
                    }
                });
        },
            it('When time is InValid', function (done) {
                chai.request(url)
                    .post('')
                    .set('Content-Type', 'application/json')
                    .send({ username: "laxmi", password: "admin123", url: "app3.html" })
                    .end((err, res) => {
                        if (res.statusCode == 500) {
                            expect(res.statusCode).to.equal(500);
                            // console.log(res.body);
                            done();
                        } else {
                            assert.fail("When TIME is valid");
                        }
                    });
            },
                it('When Constraints are Valid', function (done) {
                    chai.request(url)
                        .post('')
                        .set('Content-Type', 'application/json')
                        .send({
                            username: "johnty", password: "admin123", url: "app3.html",
                        })
                        .end((err, res) => {
                            if (res.statusCode == 200) {
                                expect(res.statusCode).to.equal(200);
                                // console.log(res.body);
                                done();
                            } else {
                                assert.fail("When Constraints are valid");
                            }
                        });
                },
                    it('When Constraints are InValid', function (done) {
                        chai.request(url)
                            .post('')
                            .set('Content-Type', 'application/json')
                            .send({
                                username: "laxmi", password: "admin123", url: "app4.html",
                            })
                            .end((err, res) => {
                                if (res.statusCode == 500) {
                                    expect(res.statusCode).to.equal(500);
                                    // console.log(res.body);
                                    done();
                                } else {
                                    assert.fail("When Constraints are Invalid");
                                }
                            });
                    },
                        it('When Constraints and Time are Valid', function (done) {
                            chai.request(url)
                                .post('')
                                .set('Content-Type', 'application/json')
                                .send({
                                    username: "ram", password: "admin123", url: "app5.html",
                                })
                                .end((err, res) => {
                                    if (res.statusCode == 200) {
                                        expect(res.statusCode).to.equal(200);
                                        // console.log(res.body);
                                        done();
                                    } else {
                                        assert.fail("When Constraints are valid");
                                    }
                                });
                        },
                            it('When Constraints are Valid and Time is  InValid', function (done) {
                                chai.request(url)
                                    .post('')
                                    .set('Content-Type', 'application/json')
                                    .send({
                                        username: "salman", password: "admin123", url: "app5.html",
                                    })
                                    .end((err, res) => {
                                        if (res.statusCode == 500) {
                                            expect(res.statusCode).to.equal(500);
                                            // console.log(res.body);
                                            done();
                                        } else {
                                            assert.fail("When Constraints and Time are valid");
                                        }
                                    });

                            },
                                it('When Constraints are InValid and Time is Valid', function (done) {
                                    chai.request(url)
                                        .post('')
                                        .set('Content-Type', 'application/json')
                                        .send({
                                            username: "amir", password: "admin123", url: "app5.html",
                                        })
                                        .end((err, res) => {
                                            if (res.statusCode == 500) {
                                                expect(res.statusCode).to.equal(500);
                                                // console.log(res.body);
                                                done();
                                            } else {
                                                assert.fail("When Constraints are Invalid and Time are valid");
                                            }
                                        })
                                })
                            )
                        )
                    )
                )
            )
        )
    })

});