const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
var data = require('./data.json');
var id;
var app=data.app_id;

chai.use(chaiHttp);
describe('Role Test', function () {
    this.timeout(15000);
    describe('Add Role', function () {
        this.timeout(15000);
        it('When Data is Valid in Add Functionality', function (done) {
            chai.request(url)
                .post('/api/role/addRole')
                .set('Content-Type', 'application/json')
                .send({ Role_name: "Manage", Application_id:app })
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);           
                        id = res.body._id;
                    //     console.log(res.body);
                        done();
                    } else {
                        assert.fail("Role already exists.");
                    }
                });
        });

        it('When Data is Invalid in Add Functionality', function (done) {
            chai.request(url)
                .post('/api/role/addRole')
                .set('Content-Type', 'application/json')
                .send({ Role_name: "", Application_id: app })
                .end((err, res) => {
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("Role already exists.");
                    }
                });
        });

        it('When Duplicate Data is being Add.', function (done) {
            chai.request(url)
                .post('/api/role/addRole')
                .set('Content-Type', 'application/json')
                .send({ Role_name: "Manage", Application_id: app })
                .end((err, res) => {
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("Data does not Exist..!");
                    }
                });
        });
    });
    describe('Update Role', function () {
        it('When Data is Valid in Update Functionality', function (done) {
            chai.request(url)
                .put('/api/role/updateRole/' + id)
                .set('Content-Type', 'application/json')
                .send({ Role_name: "Clerk", Application_id: app })
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Role not updated.");
                    }
                });
        });
    });
    describe('Delete Role', function () {
        it('Delete Functionality', function (done) {
            chai.request(url)
                .delete('/api/role/delRole/' + id)
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Role not deleted.");
                    }
                });
        });
    });
});