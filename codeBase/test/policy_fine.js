const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
var data = require('./data.json');
var id;
var app_id = data.app_id;
var rol_id = data.rol_id;       //users
var res_id = data.res_id;
var delete_updatedPoly;


var newPolicy={
 application_id: app_id,
  policy_name: 'Salary',
  policy_type: 'grant',
  policy_constrains: '1==1',
  policy_scope:"Public",
  policy_principals:
   [ { id: rol_id, type: 'role', name: 'Faculty' } ],
  policy_targets:
   [ { resource_id: res_id,
       resource_name: 'B.Sc. IT' } ] 
}
   
var policyUpdate={
    application_id: app_id,
     policy_name: 'AUdit',
     policy_type: 'grant',
     policy_constrains: '12=16',
     policy_principals:
      [ { id: rol_id, type: 'role', name: 'Faculty' } ],
     policy_targets:
      [ { resource_id: res_id,
          resource_name: 'B.Sc. IT' } ] 
   }
    var PolicyInvalid={
        application_id: app_id,
         policy_name: 'Salary',
         policy_type: 'grant',
         policy_constrains: '',
         policy_principals:
          [ { id: rol_id, type: 'role', name: 'Faculty' } ],
         policy_targets:
          [ { resource_id: res_id,
              resource_name: 'B.Sc. IT' } ]
    }
    
    

chai.use(chaiHttp);
describe('Policy Test', function () {
    this.timeout(15000);
    describe('Add Policy', function () {
        this.timeout(15000);
        it('When Data is Valid in Add Functionality', function (done) {
            chai.request(url)
                .post('/api/addPolicy')
                .set('Content-Type', 'application/json')
                .send(newPolicy)
                .end((err, res) => {
                    if (res.statusCode == 200) {
                        expect(res.statusCode).to.equal(200);
                        id = res.body.data._id;
                       
                        done();
                    } else {
                        // console.log(res.statusCode);                      
                        assert.fail("Policy already exists.");
                    }
                });
        });


        it('When Data is Invalid for Add Functionality', function (done) {
            chai.request(url)
            .post('/api/addPolicy')
            .set('Content-Type',  'application/json')
            .send(PolicyInvalid)
            .end((err, res) => {
                if(res.statusCode == 500){
                    expect(res.statusCode).to.equal(500);              
                    done();
                } else {
                    assert.fail("Test for Invalid data failed.");
                }
            });
        });

            it('When Duplicate Data is being Add', function (done) {
                chai.request(url)
                    .post('/api/addPolicy')
                    .set('Content-Type', 'application/json')
                    .send(newPolicy)
                    .end((err, res) => {
                        if (res.statusCode == 500) {
                            expect(res.statusCode).to.equal(500);
                            done();
                        } else {
                            assert.fail("Data does not exist!");
                        }
                    });
            });
        });
        describe('Update Policy', function () {
            it('When Data is Valid in Update Functionality', function (done) {
                chai.request(url)
                    .put('/api/updatePolicy/')
                    .set('Content-Type', 'application/json')
        			.send(policyUpdate)
                    .end((err, res) => {
                        if (res.statusCode == 200) {
                            expect(res.statusCode).to.equal(200);
                            // console.log(res.body);
                            
                            delete_updatedPoly=res.body.createdObj._id;
                            done();
                        } else {
                            assert.fail("Policy not updated.");
                        }
                    });
            });
        });
        describe('Delete Updated Policy', function () {
            it('Delete Functionality IN Updated Policy', function (done) {
                chai.request(url)
                    .delete('/api/delPolicy/'+ delete_updatedPoly)
                    .end((err, res) => {
                        if (res.statusCode == 200) {
                            expect(res.statusCode).to.equal(200);
                            done();
                        } else {
                            assert.fail("updated policy not deleted.");
                            // console.log(res.body);
                        }
                    });
            });
    });

        describe('Delete  Policy', function () {
            it('Delete Functionality', function (done) {
                chai.request(url)
                    .delete('/api/delPolicy/'+ id)
                    .end((err, res) => {
                        if (res.statusCode == 200) {
                            expect(res.statusCode).to.equal(200);
                            done();
                        } else {
                            assert.fail("Policy not deleted.");
                            // console.log(res.body);
                        }
                    });
            });
    });
});


