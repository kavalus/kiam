// To run this file on your PC.
// Go to the bin folder in MongoDB.
// Open Shell and run this command --> .\mongo.exe 127.0.0.1/KIAM <--- path to this file --->

// Defining some useful variables.
let AppId = new ObjectId();
let Attr1Id = new ObjectId();
let Attr2Id = new ObjectId();
let ResType1Id = new ObjectId();
let ResType1Action1Name = "read";
let ResType1Action2Name = "write";
let ResType2Action1Name = "use Lab";
let ResType2Id = new ObjectId();
let Resource1Id = new ObjectId();
let Res1Name = "B.Sc. IT";
let Resource2Id = new ObjectId();
let Res2Name = "M.Sc. IT";
let Role1Id = new ObjectId();
let Role2Id = new ObjectId();
let Role1Name = "Students";
let Role2Name = "Faculty";
let UserId = new ObjectId();
let UserName = "Dhruvesh";

// Droping DB if there is any Data.
db.dropDatabase();

// Adding Application 
db.applications.insert({
    _id : AppId,
    app_name : "University",
    app_displayname : "University",
    app_description : "University description"
});

// Adding Attributes
db.attributes.insert({
    _id : Attr1Id,
    Name : "Classes",
    Type : "Fixed",
    DataType : "String",
    Description : "Classes that are allocated to a Course.",
    Application_Id : AppId,
    Single_Multiple : "Multiple"
});

db.attributes.insert({
    _id : Attr2Id,
    Name : "StaffRoom",
    Type : "Dynamic",
    DataType : "String",
    Description : "Students who have enrolled to a Course.",
    Application_Id : AppId,
    Single_Multiple : "Multiple"
});

// Adding Resource Types & Actions
db.resourceTypes.insert({
    _id : ResType1Id,
    resourceType_name : "Courses",
    resourceType_displayname : "Courses",
    resourceType_description : "courses Description",
    resourceType_actions :  [
                                {
                                    action_name : ResType1Action1Name       // Action Name is being defined above
                                },
                                {
                                  action_name : ResType1Action2Name         // Action Name is being defined above
                                }
                            ],
    application_id : AppId
});

db.resourceTypes.insert({
    _id : ResType2Id,
    resourceType_name : "Practicals",
    resourceType_displayname : "Practicals",
    resourceType_description : "Practicals Description",
    resourceType_actions :  [
                                {
                                    action_name : ResType2Action1Name       // Action Name is being defined above
                                }
                            ],
    application_id : AppId
});

// Adding Resources
db.resource.insert({
    _id : Resource1Id,
    res_name : Res1Name,                                                    // Resource Name is given above
    res_displayname : "B.Sc. IT",
    res_descrpition : "School of IT",
    Resource_typeid : ResType1Id,
    attributes :  [
                        {
                            attribute_id : Attr1Id,
                            attribute_value : "4"
                        }
                    ],
    application_id : AppId
});

db.resource.insert({
    _id : Resource2Id,
    res_name : Res2Name,                                                    // Resource Name is given above
    res_displayname : "M.Sc. IT",
    res_descrpition : "School of IT",
    Resource_typeid : ResType2Id,
    attributes :  [
                        {
                            attribute_id : Attr2Id,
                            attribute_value : "5"
                        }
                    ],
    application_id : AppId
  });

// Adding Roles
db.Roles.insert({
    _id : Role1Id,
    Role_name      : Role1Name,                                             // Role Name is given above
    Application_id : AppId  
});

db.Roles.insert({
    _id : Role2Id,
    Role_name      : Role2Name,                                             // Role Name is given above
    Application_id : AppId 
});

db.users.insert({
    _id : UserId,
    status  :   true,
    name    :   UserName,                                                   // User Name is given above
    username:   "dhruv2103",
    password:   "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
    email   :   "dhkalathiya@gmail.com",
    role    :   [
		{
			"role_id" : Role1Id,
			"role_name": Role1Name                                          // Role Name is given above
        },
        {
			"role_id" : Role2Id,
			"role_name": Role2Name                                          // Role Name is given above
        }
	]
});

db.policies.insert({
    policy_name : "Attendance",
    application_id : AppId,
    policy_type : "grant",
    policy_constrains : "80% attendance",
    policy_principals : [
                            {
                                id   :UserId,
                                type :"user",
                                name :UserName                              // User Name is given above
                            }
                        ],
    policy_targets : [
                        {
                            resource_id             :   Resource1Id,
                            resource_name           :   Res1Name,           // Resource Name is given above
                            resourceType_Id         :   ResType1Id,
                            resourceType_actions    :   [
                                                            {
                                                                action_name : ResType1Action1Name,      // Action Name is given above
                                                                action_state: true
                                                            },
                                                            {
                                                                action_name : ResType1Action2Name,      // Action Name is given above
                                                                action_state: false
                                                            }
                                                        ]
                        }
                     ]
});

db.policies.insert({
    policy_name : "Leave Criteria",
    application_id : AppId,
    policy_type : "grant",
    policy_constrains : "20% Leave",
    policy_principals : [
                            {
                                id   :Role1Id,
                                type :"role",
                                name :Role1Name                             // Role Name is given above
                            }
                        ],
    policy_targets : [
                        {
                            resource_id             :   Resource2Id,
                            resource_name           :   Res2Name,           // Resource Name is given above
                            resourceType_Id         :   ResType2Id,
                            resourceType_actions    :   [
                                                            {
                                                                action_name : ResType2Action1Name,      // Action Name is given above
                                                                action_state: true
                                                            }
                                                        ]
                        }
                     ]
});