const mongoose = require('mongoose');
const config = require('../config/database');

//Attribute Schema
const AttributeSchema = mongoose.Schema({
    Name: {
        type: String
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
        type: String
    },
    Single_Multiple: {
        type: String
    }
});

const attributes = module.exports = mongoose.model('attributes',AttributeSchema);
