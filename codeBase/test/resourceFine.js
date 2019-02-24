const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
var data = require('./data.json');
var id;
var app_id=data.app_id;
var res_type=data.res_type_id;
var attr=data.att_id;

chai.use(chaiHttp);
describe('Resource Test  of type Fine',function(){
    this.timeout(15000);
    describe('Add Resource',function(){
        this.timeout(15000);
        it('When Data is Valid in Add Functionality', function (done) {
            chai.request(url)
            .post('/api/addResource')
            .set('Content-Type',  'application/json')
            .send({
                res_name : "BCA", 
                res_displayname : "BCA", 
                res_descrpition : "BCA Description", 
                Resource_typeid : res_type, 
                attribute_id :  [{attribute_id:attr,attribute_value:"4"}], 
                application_id : app_id,
                resourceType_type:"Fine",
            }
    )
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200); 
                    id = res.body._id;                                
                    done();
                } else {
                    assert.fail("Resource already exists.");
                }
            });
        });

        it('When Data is Invalid in Add Functionality', function (done) {
            chai.request(url)
            .post('/api/addResource')
            .set('Content-Type',  'application/json')
            .send({
                res_name : "B.Sc. IT", 
                res_displayname : "B.Sc. IT", 
                res_descrpition : "School of IT", 
                Resource_typeid : res_type, 
                attribute_id :  [{attribute_id:attr,attribute_value:"4"}], 
                application_id : "",
                resourceType_type:"Fine",
            }
        )
            .end((err, res) => {
                if(res.statusCode == 500){
                    expect(res.statusCode).to.equal(500);              
                    done();
                } else {
                    assert.fail("Resource already exists.");
                }
            });
        });

        it('When Duplicate Data is being Add.', function (done) {
            chai.request(url)
            .post('/api/addResource')
            .set('Content-Type',  'application/json')
            .send({
                res_name : "BCA", 
                res_displayname : "BCA", 
                res_descrpition : "BCA Description", 
                Resource_typeid : res_type, 
                attribute_id :  [{attribute_id:attr,attribute_value:"4"}], 
                application_id : app_id,
                resourceType_type:"Fine",
            })
            .end((err, res) => {
                if(res.statusCode == 500){
                    expect(res.statusCode).to.equal(500);              
                    done();
                } else {
                    assert.fail("Data does not Exist..!");
                }
            });
        });
    });
    describe('Update Resource',function(){
        it('When Data is Valid in Update Functionality', function (done) {
            chai.request(url)
            .put('/api/UpdateResource/' + id)
            .set('Content-Type',  'application/json')
            .send({res_name : "MCA", 
            res_displayname : "MCA", 
            res_descrpition : "MCA Description", 
            Resource_typeid : res_type, 
            attribute_id :  [{attribute_id: attr , attribute_value:"5"}], 
            application_id : app_id,
        })
            
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200);              
                    done();
                } else {
                    assert.fail("Resource not updated.");
                }
            }); 
        });
    });
    describe('Delete Resource',function(){
        it('Delete Functionality', function (done) {
            chai.request(url)
            .delete('/api/DeleteResource/' + id)
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200);              
                    done();
                } else {
                    assert.fail("Resource not deleted.");
                }
            }); 
        });
    });
});