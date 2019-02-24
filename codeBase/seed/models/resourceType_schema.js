const mongoose = require('mongoose');

const ResourceTypeSchema = mongoose.Schema({
    "resourceType_name": { type: String, required: true },
    "resourceType_displayname": { type: String },
    "resourceType_description": { type: String },
    "resourceType_type": { type: String },
    "resourceType_actions": [
        {
            "action_name": { type: String }
        }
    ],
    "application_id": { type: String, required: true }
});

//RT Schema ResourceType
const ResourceType = module.exports = mongoose.model('resourceTypes', ResourceTypeSchema); 