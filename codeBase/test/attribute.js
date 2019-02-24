const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const url = 'http://localhost:3001';
var data = require('./data.json')
var id;
var app=data.app_id;
var att={
    Name : "Tutions", 
    Type : "Fixed", 
    DataType : "String", 
    Description : "Classes that are allocated to a Course", 
    Application_Id : app, 
    Single_Multiple : "Multiple" 
    }

 chai.use(chaiHttp);
describe('Attribute Test', function () {
     this.timeout(5000);
     describe('Add Attribute', function () {
         this.timeout(5000);
         it('When Data is Valid in Add Functionality', function (done) {
             chai.request(url)
                 .post('/api/attributes/addAttribute')
                 .set('Content-Type', 'application/json')
                 .send(att)
                 .end((err, res) => {
                     if (res.statusCode == 200) {
                         expect(res.statusCode).to.equal(200);
                         id = res.body._id;
                         done();
                     } else {
                         assert.fail("Attribute already exists.");
                     }
                 });
         });
 
 
         it('When Data is Invalid in Add Functionality', function (done) {
             chai.request(url)
                 .post('/api/attributes/addAttribute')
                 .set('Content-Type', 'application/json')
                 .send({
                    Name : "", 
                    Type : "Fixed", 
                    DataType : "String", 
                    Description : "Classes that are allocated to a Course", 
                    Application_Id : app, 
                    Single_Multiple : "Multiple" 
                })
                 .end((err, res) => {
                     if (res.statusCode == 500) {
                         expect(res.statusCode).to.equal(500);
                         done();
                     } else {
                         assert.fail("Attribute already exists.");
                     }
                 });
         });
 
 
         it('When Duplicate Data is being Added.', function (done) {
             chai.request(url)
                 .post('/api/attributes/addAttribute')
                 .set('Content-Type', 'application/json')
                 .send(att)
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
     describe('Update Attribute', function () {
         it('When Data is Valid in Update Functionality', function (done) {
             chai.request(url)
                 .put('/api/attributes/updateAttribute')
                 .set('Content-Type', 'application/json')
                 .send({_id: id, Name : "Coachings", Type : "Dynamic", DataType : "String", Description : "All Classes that are allocated to a Course", Application_Id : " 5aaa377a4284b328904e3619 ", Single_Multiple : "Multiple" })
                 .end((err, res) => {
                     if (res.statusCode == 200) {
                         expect(res.statusCode).to.equal(200);
                         done();
                     } else {
                         assert.fail("Attributes not updated.");
                     }
                 });
         });
     });
     describe('Delete Attribute', function () {
         it('Delete Functionality', function (done) {
             chai.request(url)
                 .delete('/api/attributes/deleteAttribute/' + id)
                 .end((err, res) => {
                     if (res.statusCode == 200) {
                         expect(res.statusCode).to.equal(200);
                         done();
                     } else {
                         assert.fail("Attribute is not deleted.");
                     }
                 });
         });
     });
 });
 