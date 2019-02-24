const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const fs = require('fs');

//models
const App = require('./models/app_schema');
const Attribute = require('./models/attribute_schema');
const ResourceType = require('./models/resourceType_schema');
const Resource = require('./models/resource_schema');
const Role = require('./models/role_schema');
const User = require('./models/user_schema');
const Policy = require('./models/policy_schema');

// Mongoose Connection

// Connect To Database
mongoose.connect(config.database + config.args);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connecting to database ...');
}).then(() => { // if all is ok we will be here
  console.log('Authenticated to the database ' + config.database);
})
  .catch(err => { // we will not be here...
    console.error('MongoDb Connection Error', err);
  });

// Removing Data from DB.

App.remove({}, (err, success) => {
  if (err) console.log(err);
  else console.log('Application Data is being Deleted Successfully..!');
});

Attribute.remove({}, (err, success) => {
  if (err) console.log(err);
  else console.log('Attribute Data is being Deleted Successfully..!');
});

ResourceType.remove({}, (err, success) => {
  if (err) console.log(err);
  else console.log('ResourceType Data is being Deleted Successfully..!');
});

Resource.remove({}, (err, success) => {
  if (err) console.log(err);
  else console.log('Resource Data is being Deleted Successfully..!');
});

Role.remove({}, (err, success) => {
  if (err) console.log(err);
  else console.log('Role Data is being Deleted Successfully..!');
});

User.remove({}, (err, success) => {
  if (err) console.log(err);
  else console.log('User Data is being Deleted Successfully..!');
});

Policy.remove({}, (err, success) => {
  if (err) console.log(err);
  else console.log('Policy Data is being Deleted Successfully..!');
})


// Adding Data to DB.

let AppObj = new App({
  app_name: "Coarse_app",
  app_displayname: "Coarse_app",
  app_description: "Coarse_app description",
});
AppObj.save().then((AppData) => {
  let newappid = {
    Application_Id: AppData._id,
  }
  module.exports = newappid;
  let AttrObjs = [
    // {
    //   Name: "coarse_attribute",
    //   Type: "Fixed",
    //   DataType: "String",
    //   Description: "coarse_attribute description",
    //   Application_Id: AppData._id,
    //   Single_Multiple: "Multiple"
    // },
    {
      Name: "Min_discount",
      Type: "Fixed",
      DataType: "String",
      Description: "Min_discount that are allocated to a Course.",
      Application_Id: AppData._id,
      Single_Multiple: "Multiple"
    },
    {
      Name: "Max_discount",
      Type: "Fixed",
      DataType: "String",
      Description: "Max_discount that are allocated to a Course.",
      Application_Id: AppData._id,
      Single_Multiple: "Multiple"
    },
  ];

  let ResourceTypeObjs = [
    {
      resourceType_name: "coarse_resource_type",
      resourceType_displayname: "coarse_resource_type",
      resourceType_description: "coarse_resource_type Description",
      resourceType_type: "Coarse",
      resourceType_actions: [
        {
          action_name: "PUT"
        }
      ],
      application_id: AppData._id
    }
  ];

  return new Promise(async (resolve, reject) => {
    let AttrArrayId = [];
    let ResTypeArrayId = [];
    await Attribute.insertMany(AttrObjs).then((AttrData) => {
      for (let i = 0; i < AttrData.length; i++) {
        if (AttrData[i].Type == 'Fixed') {
          AttrArrayId.push(AttrData[i]._id);
        }
      }
    });
    await ResourceType.insertMany(ResourceTypeObjs).then((ResTypeData) => {
      for (let i = 0; i < ResTypeData.length; i++) {
        let arrayAction = [];
        for (let j = 0; j < ResTypeData[i].resourceType_actions.length; j++) {
          if (j / 2 == 0) {
            arrayAction.push({ action_name: ResTypeData[i].resourceType_actions[j].action_name, action_state: true });
          } else {
            arrayAction.push({ action_name: ResTypeData[i].resourceType_actions[j].action_name, action_state: false });
          }
          //array action in resource type
          // console.log(arrayAction);
          if (j == (ResTypeData[i].resourceType_actions.length - 1)) {
            ResTypeArrayId.push({ ResType_Id: ResTypeData[i]._id, Res_Action: arrayAction });
          }
        }
        if (i == (ResTypeData.length - 1)) {
          resolve({ ResTypes: ResTypeArrayId, Attrs_id: AttrArrayId });
        }
        // ResTypeArrayId.push(ResTypeData[i]._id);
      }
    });

  }).then((resolveData) => {
    // console.log(resolveData.ResTypes[0].Res_Action);

    // console.log('Attribute ID : ' + resolveData.Attrs_id);

    let ResourceArrayId = [];
    let RoleArrayId = [];

    let ResourceObjs = [
      {
        res_name: "Public_resource",
        res_displayname: "Public_resource",
        res_description: "Public_resource Accessories",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        application_id: AppData._id
        , Authentication_type: "single",
        Protection_type: "Public",
        Protocol_type: "HTTP",
        url: "app1.html"

      },
      {
        res_name: "Protected_resource_single",
        res_displayname: "Protected_resource_single",
        res_description: "Protected_resource_single description",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        application_id: AppData._id
        , Authentication_type: "single",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "app2.html"
      },
      ,
      {
        res_name: "Protected_resource_multiple",
        res_displayname: "Protected_resource_multiple",
        res_description: "Protected_resource_multiple description",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        application_id: AppData._id,
        Authentication_type: "multiple",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "faq.html"
      },
      {
        res_name: "Protected_resource_single2",
        res_displayname: "Protected_resource_single2",
        res_description: "Protected_resource_single2 description",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        application_id: AppData._id
        , Authentication_type: "single",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "app3.html",
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "10"
          }
        ],
      },
      {
        res_name: "Protected_resource_single3",
        res_displayname: "Protected_resource_single3",
        res_description: "Protected_resource_single3 description",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        application_id: AppData._id
        , Authentication_type: "single",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "app4.html",
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "10"
          }
        ],
      },
      {
        res_name: "Mock_resource",
        res_displayname: "Mock_resource",
        res_description: "Mock_resource description",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        application_id: AppData._id
        , Authentication_type: "single",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "app5.html",
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[1],
            attribute_value: "5"
          }
        ],
      }
    ];

    let RoleObjs = [
      {
        Role_name: "Manager",
        Application_id: AppData._id
      }
    ];

    return new Promise(async (resolve, reject) => {
      await Resource.insertMany(ResourceObjs).then((ResourceData) => {
        for (let i = 0; i < ResourceData.length; i++) {
          // console.log(ResourceData[i]);
          ResourceArrayId.push({ res_id: ResourceData[i]._id, res_name: ResourceData[i].res_name });
        }
      });

      await Role.insertMany(RoleObjs).then((RoleData) => {
        for (let i = 0; i < RoleData.length; i++) {
          // console.log(RoleData[i]);
          RoleArrayId.push({ role_id: RoleData[i]._id, role_name: RoleData[i].Role_name });
          if (i == (RoleData.length - 1)) {
            // console.log({Roles_Id : RoleArrayId, Resources_Id : ResourceArrayId});
            resolve({ Roles: RoleArrayId, Resources_Id: ResourceArrayId });
          }
        }
      });

    }).then(async (resolve2Data) => {
      // console.log(resolve2Data.Roles, resolve2Data.Resources_Id);

      let User_ID = '';
      let User_name = '';

      let UserObj = [{
        role: resolve2Data.Roles,
        status: true,
        name: "admin",
        username: "admin",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        email: "sdas@kavalus.com",
        user_type: "System"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "rahul",
        username: "rahul",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        email: "sdas@kavalus.com",
        user_type: "System"
      },

      {
        role: resolve2Data.Roles,
        status: true,
        name: "sumit",
        username: "sumit",
        email: "sdas@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "System"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "pinank",
        username: "pinank",
        email: "pinank@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "johnty",
        username: "johnty",
        email: "pinank@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "laxmi",
        username: "laxmi",
        email: "laxmi@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "ram",
        username: "ram",
        email: "ram@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "salman",
        username: "salman",
        email: "salman@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "amir",
        username: "amir",
        email: "amir@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles,
        status: true,
        name: "amish",
        username: "amish",
        email: "amish@kavalus.com",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        user_type: "Identity",
        qr_code:"asdasd",
        device_ID:"abc"
      },
      ];

      await User.insertMany(UserObj).then((UserData) => {
        User_ID = UserData._id;
        User_name = UserData.name;
      });

      //Ids required for Tests ******************
      var app_id = AppData._id;
      var att_id = resolveData.Attrs_id;
      var us = User_ID;

      // var usr_id=us[0]._id;
      var usr_id = us;
      var res_type_id = resolveData.ResTypes[0].ResType_Id
      var res_id = resolve2Data.Resources_Id[0].res_id;
      var data = { app_id, att_id, usr_id, res_type_id, res_id };

      var writeData = fs.writeFile("../test/data.json", JSON.stringify(data), (err, result) => {  // WRITE
        if (err) {
          return console.error(err);
        } else {
          console.log("Success");
        }

      });

      let PolicyObj = [
        {
          policy_name: "Coarse_public Policy",
          application_id: AppData._id,
          policy_type: "grant",
          policy_scope: "Public",
          polygrain: "Coarse",
          policy_constrains: "",
          policy_principals: [
            {
              id: UserObj[1]._id,
              type: "user",
              name: UserObj[1].name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[0].res_id,
              resource_name: resolve2Data.Resources_Id[0].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Coarse_protected Policy",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          policy_principals: [
            {
              id: UserObj[2]._id,
              type: "user",
              name: UserObj[2].name
            },
            {
              id: UserObj[9]._id,
              type: "user",
              name: UserObj[9].name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[1].res_id,
              resource_name: resolve2Data.Resources_Id[1].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            },
            {
              resource_id: resolve2Data.Resources_Id[2].res_id,
              resource_name: resolve2Data.Resources_Id[2].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Coarse_Protected_Time",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: true,
          auth_ip: false,
          auth_time_start: "11:00",
          auth_time_end: "24:00",
          policy_principals: [
            {
              id: UserObj[3]._id,
              type: "user",
              name: UserObj[3].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[3].res_id,
              resource_name: resolve2Data.Resources_Id[3].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Coarse_Protected_TimeInvalid",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: true,
          auth_ip: false,
          auth_time_start: "10:00",
          auth_time_end: "13:00",
          policy_principals: [
            {
              id: UserObj[5]._id,
              type: "user",
              name: UserObj[5].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[3].res_id,
              resource_name: resolve2Data.Resources_Id[3].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Coarse_Protected_Constraints",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: false,
          auth_ip: false,
          policy_constrains: "#Min_discount <= 12",
          policy_principals: [
            {
              id: UserObj[4]._id,
              type: "user",
              name: UserObj[4].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[3].res_id,
              resource_name: resolve2Data.Resources_Id[3].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Coarse_Protected_Constraints2",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: false,
          auth_ip: false,
          policy_constrains: "#Min_discount <= 12",
          policy_principals: [
            {
              id: UserObj[4]._id,
              type: "user",
              name: UserObj[4].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[3].res_id,
              resource_name: resolve2Data.Resources_Id[3].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Coarse_Protected_Constraints3",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: false,
          auth_ip: false,
          policy_constrains: "#Min_discount <= 9",
          policy_principals: [
            {
              id: UserObj[5]._id,
              type: "user",
              name: UserObj[5].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[4].res_id,
              resource_name: resolve2Data.Resources_Id[4].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Mock policy",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: true,
          auth_ip: false,
          auth_time_start: "10:00",
          auth_time_end: "24:00",
          policy_constrains: "#Max_discount <= 8",
          policy_principals: [
            {
              id: UserObj[6]._id,
              type: "user",
              name: UserObj[6].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[5].res_id,
              resource_name: resolve2Data.Resources_Id[5].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Mock policy2",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: true,
          auth_ip: false,
          auth_time_start: "10:00",
          auth_time_end: "14:00",
          policy_constrains: "#Max_discount <= 10",
          policy_principals: [
            {
              id: UserObj[7]._id,
              type: "user",
              name: UserObj[7].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[5].res_id,
              resource_name: resolve2Data.Resources_Id[5].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },
        {
          policy_name: "Mock policy3",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Protected",
          polygrain: "Coarse",
          auth_time: true,
          auth_ip: false,
          auth_time_start: "10:00",
          auth_time_end: "24:00",
          policy_constrains: "#Max_discount <= 4",
          policy_principals: [
            {
              id: UserObj[8]._id,
              type: "user",
              name: UserObj[8].name
            }
          ],
          policy_targets: [

            {
              resource_id: resolve2Data.Resources_Id[5].res_id,
              resource_name: resolve2Data.Resources_Id[5].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        }
      ];

      await Policy.insertMany(PolicyObj).then((PolicyData) => {
        console.log('All Data is being added to DB successfully..!');
        mongoose.connection.close({

        });
        console.log('Connection Close');
      });

    });

  });

});
