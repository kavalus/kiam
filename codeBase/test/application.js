const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
var id;

chai.use(chaiHttp);
describe('Application Test',function(){
    this.timeout(5000);
    describe('Add an Application',function(){
        this.timeout(5000); 
        it('When Data is Valid for Add Functionality', function (done) {
            chai.request(url)
            .post('/api/addApp')
            .set('Content-Type',  'application/json')
            .send({
                app_name : "ABC",
                app_displayname : "ABC ",
                app_description : "ABC",
                // app_type:"Coarse"
            })
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200); 
                    id = res.body._id;
                                 
                    done();
                } else {
                    assert.fail("Application already exists in the system.");
                }
            });
        });
        it('When Data is added in Add Functionality', function (done) {
            chai.request(url)
            .get('/api/application/'+id)
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200); 
                    done();
                } else {
                    assert.fail("Application not added in the system.");
                }
            });
        });

        it('When Data is Invalid for Add Functionality', function (done) {
            chai.request(url)
            .post('/api/addApp')
            .set('Content-Type',  'application/json')
            .send({
                    app_name : "",
                    app_displayname : "University",
                    app_description : "University description",
                    // app_type:""
                })
            .end((err, res) => {
                if(res.statusCode == 500){
                    expect(res.statusCode).to.equal(500);              
                    done();
                } else {
                    assert.fail("Test for Invalid data failed.");
                }
            });
        });

        it('When Duplicate Data is being Added.', function (done) {
            chai.request(url)
            .post('/api/addApp')
            .set('Content-Type',  'application/json')
            .send({
                app_name : "ABC",
                app_displayname : "ABC ",
                app_description : "ABC",
                // app_type:"Coarse"
                
            })
            .end((err, res) => {
                if(res.statusCode == 500){
                    expect(res.statusCode).to.equal(500);              
                    done();
                } else {
                    assert.fail("Data is not in order");
                }
            });
        });
    });
    describe('Update Application',function(){
        it('When Data is Valid for Update Functionality', function (done) {
            chai.request(url)
            .put('/api/updateApp/' + id)
            .set('Content-Type',  'application/json')
            .send({
                    app_name : "ABC University",
                    app_displayname : "ABC University",
                    app_description : "ABC University description",
                    // app_type:"Fine"
           
                })
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200);              
                    done();
                } else {
                    assert.fail("Test for Update Application Failed.");
                }
            }); 
        });
    });
    describe('Delete Application',function(){
        it('Delete Functionality', function (done) {
            chai.request(url)
            .delete('/api/delApp/' + id)
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200);              
                    done();
                } else {
                    assert.fail("Test for Delete Application Failed.");
                }
            }); 
        });
    });
});

