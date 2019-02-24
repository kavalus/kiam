const mongoose = require('mongoose');
const config = require('../config/database');
//Resource Schema
const ResourceSchema = mongoose.Schema({
    res_name: { type:String },
    res_displayname: { type: String },
    res_description: { type:String },
    Resource_typeid: { type:String },
    grain: { type:String },
    attributes: [
        {
            attribute_id    : { type: String },
            attribute_value : { type: String }
        }
    ],
    application_id:{ type:String, required:true },
    Authentication_type:{ type:String },
    Protection_type:{ type:String },
    Protocol_type:{ type:String },
    url:{ type:String },
});

const resource = module.exports = mongoose.model('resource', ResourceSchema);