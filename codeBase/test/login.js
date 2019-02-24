const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
chai.use(chaiHttp);

describe('Login API', function () {
    this.timeout(5000);
    it('When Login with valid Credentials', function (done) {
        chai.request(url)
            .post('/users/authenticate/')
            .set('Content-Type', 'application/json')
            .send({ username: 'admin', password: 'admin123' })
            .end((err, res) => {
                if (res.statusCode == 200) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }else if (res.statusCode == 500) {
                    console.log('Error..!');
                }
                else {
                    expect(res.statusCode).to.equal(500);
                    console.log('Test failed for login');
                    done();
                }
            });
    // }); it('When Login with invalid Credentials', function (done) {
    //     chai.request(url)
    //         .post('/users/authenticate')
    //         .set('Content-Type', 'application/json')
    //         .send({ username: '', password: 'admin123' })
    //         .end((err, res) => {
    //             if (res.statusCode != 200) {
    //                 expect(res.statusCode).to.equal(500);
    //                 done();
    //             // }else if (res.statusCode == 500) {
    //             //     console.log('Error..!');
    //             }
    //             else {
    //                 expect(res.statusCode).to.equal(200);
    //                 assert.fail("Test for User Authentication Failed");
    //                 done();
    //             }
    //         });
    });
});
