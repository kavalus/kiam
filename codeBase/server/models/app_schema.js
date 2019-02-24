//import {Schema,model} from 'mongoose';

const mongoose = require('mongoose'); 

const AppSchema = mongoose.Schema({
        "app_name"          :   { type: String,  required: true,unique:true },
        "app_displayname"   :   { type: String },
        // "app_type"           :   { type: String ,  required: true},
      "app_description"   :   { type: String },
});

const App = module.exports = mongoose.model('applications', AppSchema);