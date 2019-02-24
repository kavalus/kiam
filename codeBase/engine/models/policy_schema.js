const mongoose = require('mongoose');

//Policy Schema
const PolicySchema = mongoose.Schema(
    {
        "policy_name"           :   { type: String },
        "application_id"        :   { type: String },
        "policy_type"           :   { type: String,},
        "policy_constrains"     :   { type: String,},
        "policy_principals"     :   [
                                        { 
                                            "id"  : { type : String },
                                            "type": { type : String },
                                            "name": { type : String }
                                        }
                                    ],
        "policy_targets"        :   [
                                        {
                                            "resource_id"           : { type : String },
                                            "resource_name"         : { type : String },
                                            "resourceType_Id"       : { type : String },
                                            "resourceType_actions"  : [ 
                                                                        { 
                                                                            "action_name"   : { type : String  },
                                                                            "action_state"  : { type : Boolean, default: false }    
                                                                        }  
                                                                      ]
                                        }
                                    ]
    }
);

const resources = module.exports = mongoose.model('policies',PolicySchema);


