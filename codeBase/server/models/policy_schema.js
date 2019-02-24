const mongoose = require('mongoose');

const PolicySchema = mongoose.Schema(
    {
        "policy_name"           :   { type: String, required:true, unique : true, dropDups: true },
        "application_id"        :   { type: String },
        "policy_type"           :   { type: String},
        "policy_constrains"     :   { type: String},
        "polygrain"     :   { type: String},
        "policy_scope" : { type: String},
        "policy_response" : { type: String},

        
        "policy_principals"     :   [
                                        { 
                                            "id"  : { type : String },
                                            "type": { type : String },
                                            "name": { type : String }
                                        }
                                    ],

                                    "auth_ip"      : {type : Boolean, default: false },
                                    "auth_ip_start": { type : String },
                                    "auth_ip_end"  : { type : String },

                                      "auth_time": {type : Boolean, default: false },
                                "auth_time_start": { type : String },
                                 "auth_time_end"  : { type : String },
                                           "alloted_days": [
                                                    {type : String}
                                                   ],                                                    
        "policy_targets"        :   [
                                        {
                                            "resource_id"           : { type : String,required:true },
                                            "resource_name"         : { type : String },
                                            "resourceType_Id"       : { type : String,required:true },
                                            "resourceType_actions"  : [ 
                                                                        { 
                                                                            "action_name"   : { type : String,required:true  },
                                                                            "action_state"  : { type : Boolean, default: false }    
                                                                        }  
                                                                      ]
                                        }
                                    ]
    }
);

const resources = module.exports = mongoose.model('policies',PolicySchema);
// const Ip = module.exports = mongoose.model('policies',Ip_Schema);
// const Time = module.exports = mongoose.model('policies',Time_Schema);




