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
    this.timeout(5000);
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
});
