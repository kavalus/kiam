const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
chai.use(chaiHttp);
var data = require('./data.json');
var id;
var app = data.app_id;
var res_data =
{
    resourceType_name: "Tutorials",
    resourceType_displayname: "Tutorials",
    resourceType_description: "Tutorials Description",
    resourceType_actions: [{ action_name: "PUT" }],
    application_id: app,
    resourceType_type:"Coarse",
}

chai.use(chaiHttp);
describe('Resource_Type Test  of type Coarse', function () {
    this.timeout(15000);
    describe('Add Resource-Type', function () {
        this.timeout(15000);
        it('When Data is Valid in Add Functionality', function (done) {
            chai.request(url)
                .post('/api/addResourceType')
                .set('Content-Type', 'application/json')
                .send(res_data)
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        id = res.body._id;
                        done();
                    } else {
                        assert.fail("Resource-Type already exists.");
                    }
                });
        });

        it('When Data is Invalid in Add Functionality', function (done) {
            chai.request(url)
                .post('/api/addResourceType')
                .set('Content-Type', 'application/json')
                .send({
                    resourceType_name: "",
                    resourceType_displayname: "Courses",
                    resourceType_description: "courses Description",
                    resourceType_actions: [{ action_name: "get" }],
                    application_id: app,
                    resourceType_type:"Coarse",
                })
                .end((err, res) => {
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("ResourceType not Valid.");
                    }
                });
        });

        it('When Duplicate Data is being Add.', function (done) {
            chai.request(url)
                .post('/api/addResourceType')
                .set('Content-Type', 'application/json')
                .send(res_data)
                .end((err, res) => {
                    if (res.statusCode == 500) {
                        expect(res.statusCode).to.equal(500);
                        done();
                    } else {
                        assert.fail("Data already exists!");
                    }
                });
        });
    });
    describe('Update Resource-Type', function () {
        it('When Data is Valid in Update Functionality', function (done) {
            chai.request(url)
                .put('/api/updateResourceType/' + id)
                .set('Content-Type', 'application/json')
                .send({
                    resourceType_name: "Udemy Course",
                    resourceType_displayname: "Udemy Course",
                    resourceType_description: "Udemy course Description",
                    resourceType_actions: [{ action_name: "Delete" }],
                    application_id: app,
                    resourceType_type:"Coarse",
                })
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Resource-Type not updated.");
                    }
                });
        });
    });
    describe('Delete Resource-Type', function () {
        it('Delete Functionality', function (done) {
            chai.request(url)
                .delete('/api/delResourceType/' + id)
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    } else {
                        assert.fail("Resource-Type not deleted.");
                    }
                });
        });
    });
});