const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
var data = require('./data.json');
var id;
var rol=data.rol_id;
var user={
    role:[{role_id:rol,
    role_name:"Students"}], 
    status:true, 
    name:"Intern", 
    username:"Intern", 
    password:"$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou", 
    email:"Intern@gmail.com",
    user_type:"System"
    }
    // var userdup={
    //     role:[{role_id:rol,
    //     role_name:"Students"}], 
    //     status:true, 
    //     name:"Intern", 
    //     username:"Intern", 
    //     password:"$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou", 
    //     email:"Intern@gmail.com",
    //     user_type:"System"
    //     }
    
    var user_invalid={
        role:[{role_id:rol,
        role_name:"Professors"}], 
        status:true, 
        name:"", 
        username:"rahul", 
        password:"$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou", 
        email:"rahul@gmail.com"
        }
        var user_update={
            role:[{role_id:rol,
            role_name:"update"}], 
            status:true, 
            name:"update", 
            username:"update", 
            password:"$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou", 
            email:"rahul@gmail.com",
            user_type:"Identity"
            }
            

    
chai.use(chaiHttp);
describe('Users Test',function(){
    this.timeout(5000);
    describe('Add Users',function(){
        this.timeout(5000);
        it('When Data is Valid in Add Functionality', function (done) {
            chai.request(url)
            .post('/api/user/Add')
            .set('Content-Type',  'application/json')
            .send(user)
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200); 
                    id = res.body.data._id;         
                    done();
                } else {
                    assert.fail("User already exists.");
                }
            });
        });

        it('When Data is Invalid in Add Functionality', function (done) {
            chai.request(url)
            .post('/api/user/Add')
            .set('Content-Type',  'application/json')
            .send(user_invalid)
            .end((err, res) => {
                if(res.statusCode == 500){
                    expect(res.statusCode).to.equal(500);              
                    done();
                } else {
                    assert.fail("User does not exist.");
                }
            });
        });

        it('When Duplicate User is being Add.', function (done) {
            chai.request(url)
            .post('/api/user/Add')
            .set('Content-Type',  'application/json')
            .send(user)
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
    describe('Update Users',function(){
        it('When Data is Valid in Update Functionality', function (done) {
            chai.request(url)
            .put('/api/UpdateUser/' + id)
            .set('Content-Type',  'application/json')
            .send(user_update)
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200);              
                    done();
                } else {
                    assert.fail("User not updated.");
                }
            }); 
        });
    });
    describe('Delete Users',function(){
       
        
        it('Delete Functionality', function (done) {
            chai.request(url)
            .delete('/api/DelUser/' + id)
            .end((err, res) => {
                if(res.statusCode == 200){
                    expect(res.statusCode).to.equal(200);              
                    done();
                } else {
                    assert.fail("User not deleted.");
                }
            }); 
        });
    });
});