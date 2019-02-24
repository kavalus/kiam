const mongoose = require('mongoose');
const config = require('../config/database');

//Attribute Schema
const AttributeSchema = mongoose.Schema({
    Name: {
        type: String, required: true,unique:true
    },
    Type: {
        type: String
       
    },
    DataType: {
        type: String
       
    },
    Description: {
        type: String
    },
    Application_Id: {
        type: String,required:true    },
    Single_Multiple: {
        type: String
    }
});

const attributes = module.exports = mongoose.model('attributes',AttributeSchema);
