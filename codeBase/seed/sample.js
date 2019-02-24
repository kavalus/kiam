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
});


// Adding Data to DB.

let AppObj = new App({
  app_name: "Shopping App",
  app_displayname: "Shopping",
  app_description: "Shopping description",
  // app_type:"Fine",
});
let AppObj2 = [

  {
    app_name: "Ekart App",
    app_displayname: "Ekart",
    app_description: "Ekart description",
    // app_type:"Fine",
  },
  {
    app_name: "Readers App",
    app_displayname: "Readers",
    app_description: "Readers description",
    // app_type:"Coarse",
  },
  {
    app_name: "Feedback App",
    app_displayname: "Feedback",
    app_description: "Feedback description",
    // app_type:"Coarse",
  }

];

App.insertMany(AppObj2).then((AppData) => {
  App_Id: AppData._id

});


// AppObj2.save().then((AppData) => {
//   let newappid = {
//     Application_Id: AppData._id,
//   }
// });

AppObj.save().then((AppData) => {
  let newappid = {
    Application_Id: AppData._id,
  }
  module.exports = newappid;
  let AttrObjs = [
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
      Description: "Laboratories description.",
      Application_Id: AppData._id,
      Single_Multiple: "Multiple"
    },
    {
      Name: "Fast_moving",
      Type: "Dynamic",
      DataType: "String",
      Description: "Students who have enrolled to a Course.",
      Application_Id: AppData._id,
      Single_Multiple: "Multiple"
    }
  ];

  let ResourceTypeObjs = [
    {
      resourceType_name: "Product Category",
      resourceType_displayname: "Product Category",
      resourceType_description: "Product Category Description",
      resourceType_type: "Fine",
      resourceType_actions: [
        {
          action_name: "buy"
        },
        {
          action_name: "sell"
        }
      ],
      application_id: AppData._id
    },
    {
      resourceType_name: "Product",
      resourceType_displayname: "Product",
      resourceType_description: "Product Description",
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
        res_name: "Electronics",
        res_displayname: "Electronics",
        res_description: "Electronic Accessories",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "4"
          }
        ],
        application_id: AppData._id
        , Authentication_type: "KIAM",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "app2.html"

      },
      {
        res_name: "Apple",
        res_displayname: "Apple",
        res_description: "Cellphone Giant",
        Resource_typeid: resolveData.ResTypes[1].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "5"
          }
        ],
        application_id: AppData._id
        , Authentication_type: "KIAM",
        Protection_type: "Public",
        Protocol_type: "HTTP",
        url: "app1.html"
      },
      {
        res_name: "Clothing",
        res_displayname: "Clothing",
        res_description: "Cotton Fabric",
        Resource_typeid: resolveData.ResTypes[0].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "5"
          }
        ],
        application_id: AppData._id,
        Protection_type: "Protected",

        url: "www.y4y.com"
      },

      {
        res_name: "Levis",
        res_displayname: "Levis",
        res_description: "Clothing Company USA",
        Resource_typeid: resolveData.ResTypes[1].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[2],
            attribute_value: "5"
          }
        ],
        application_id: AppData._id
      },
      {
        res_name: "Pepe",
        res_displayname: "Pepe",
        res_description: "Clothing Company UK",
        Resource_typeid: resolveData.ResTypes[1].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "5"
          }
        ],
        application_id: AppData._id
      },

      {
        res_name: "Protected resource 1",
        res_displayname: "Coarse resource",
        res_description: "Coarse resource UK",
        Resource_typeid: resolveData.ResTypes[1].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "5"
          }
        ],
        application_id: AppData._id,
        Authentication_type: "KIAM",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "www.kavalus.com"
      },
      {
        res_name: "Protected resource 2",
        res_displayname: "Coarse resource",
        res_description: "Coarse resource UK",
        Resource_typeid: resolveData.ResTypes[1].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "5"
          }
        ],
        application_id: AppData._id,
        Authentication_type: "KIAM",
        Protection_type: "Protected",
        Protocol_type: "HTTP",
        url: "www.yo.com"
      },
      ,
      //  {
      //   res_name: "Public resource 1",
      //   res_displayname: "Coarse resource",
      //   res_description: "Coarse resource UK",
      //   Resource_typeid: resolveData.ResTypes[1].ResType_Id,
      //   attributes: [
      //     {
      //       attribute_id: resolveData.Attrs_id[0],
      //       attribute_value: "5"
      //     }
      //   ],
      //   application_id: AppData._id,
      //   Authentication_type : "KIAM",
      //   Protection_type: "Public",
      //   Protocol_type : "HTTP",
      //   url : "www.pqr.com" 
      // }, 
      {
        res_name: "Public resource 2",
        res_displayname: "Coarse resource",
        res_description: "Coarse resource UK",
        Resource_typeid: resolveData.ResTypes[1].ResType_Id,
        attributes: [
          {
            attribute_id: resolveData.Attrs_id[0],
            attribute_value: "5"
          }
        ],
        application_id: AppData._id,
        Authentication_type: "KIAM",
        Protection_type: "Public",
        Protocol_type: "HTTP",
        url: "www.xyz.com"
      }
    ];

    let RoleObjs = [
      {
        Role_name: "Manager",
        Application_id: AppData._id
      },
      {
        Role_name: "Wholeseller",
        Application_id: AppData._id
      },
      {
        Role_name: "Retailer",
        Application_id: AppData._id
      },
      {
        Role_name: "chef",
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
      }
        ,
      {
        role: resolve2Data.Roles[2],
        status: true,
        name: "amunshi",
        username: "amunshi",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        email: "sdas@kavalus.com"
        ,
        user_type: "System"
      },
      {
        role: resolve2Data.Roles[1],
        status: true,
        name: "omkar",
        username: "omkar",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        email: "sdas@kavalus.com"
        ,
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles[0],
        status: true,
        name: "rahul",
        username: "rahul",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        email: "sdas@kavalus.com"
        ,
        user_type: "System"
      },
      {
        role: resolve2Data.Roles[0],
        status: true,
        name: "abhi",
        username: "abhi",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        email: "sdas@kavalus.com"
        ,
        user_type: "Identity"
      },
      {
        role: resolve2Data.Roles[2],
        status: true,
        name: "laxmikant",
        username: "laxmikant",
        password: "$2a$04$zPxFnAig5TZjz9f/mdOzmOH4LLgioAgAfhe4Hd/Qff1HlsAxJm3Ou",
        email: "sdas@kavalus.com"
        ,
        user_type: "System"
      },
      {
        role: resolve2Data.Roles[3],
        status: true,
        name: "sumit",
        username: "sumit",
        email: "sdas@kavalus.com"

        ,
        user_type: "System"
      }
      ];

      // await UserObj.save().then((UserData) => {
      //   // console.log(UserData);
      //   User_ID = UserData._id;
      //   User_name = UserData.name;
      // });

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
          policy_name: "Sales Policy",
          application_id: AppData._id,
          policy_type: "grant",
          policy_scope: "Protected",
          polygrain: "Coarse",
          policy_constrains: "#Min_discount == 10",
          auth_ip: true,
          auth_time: true,
          auth_ip_start: "255.255.255.230",
          auth_ip_end: "255.255.255.255",
          auth_time_start: "6:00",
          auth_time_end: "20:00",
          policy_principals: [
            {
              id: UserObj[2]._id,
              type: "user",
              name: UserObj[2].name
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
          policy_name: "Manufacturer's Policy",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "",
          policy_scope: "Public",
          polygrain: "Coarse",
          auth_ip: true,
          auth_time: true,
          auth_ip_start: "255.255.255.250",
          auth_ip_end: "255.255.255.255",
          auth_time_start: "12.00",
          auth_time_end: "24.00",
          policy_principals: [
            {
              id: UserObj[3]._id,
              type: "user",
              name: UserObj[3].name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[0].res_id,
              resource_name: resolve2Data.Resources_Id[0].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
            ,
            {
              resource_id: resolve2Data.Resources_Id[1].res_id,
              resource_name: resolve2Data.Resources_Id[1].res_name,
              resourceType_Id: resolveData.ResTypes[1].ResType_Id,
              resourceType_actions: resolveData.ResTypes[1].Res_Action
            }
          ]
        },
        {
          policy_name: "Retailer's Policy",
          application_id: AppData._id,
          policy_scope: "Protected",
          polygrain: "Coarse",
          policy_type: "grant",
          policy_constrains: "#Min_discount == 5",
          auth_ip: false,
          auth_time: true,
          auth_ip_start: "",
          auth_ip_end: "",
          auth_time_start: "00.00",
          auth_time_end: "8.00",
          policy_principals: [
            {
              id: UserObj[4]._id,
              type: "user",
              name: UserObj[4].name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[2].res_id,
              resource_name: resolve2Data.Resources_Id[2].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            },

            {
              resource_id: resolve2Data.Resources_Id[1].res_id,
              resource_name: resolve2Data.Resources_Id[1].res_name,
              resourceType_Id: resolveData.ResTypes[1].ResType_Id,
              resourceType_actions: resolveData.ResTypes[1].Res_Action
            }
          ]
        },
        {
          policy_name: "Stock Policy",
          application_id: AppData._id,
          policy_scope: "Protected",
          polygrain: "Fine",
          policy_type: "grant",
          policy_constrains: "",
          auth_ip: false,
          auth_time: false,
          auth_ip_start: "",
          auth_ip_end: "",
          auth_time_start: "",
          auth_time_end: "",
          policy_principals: [
            {
              id: UserObj[0]._id,
              type: "user",
              name: UserObj[0].name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[2].res_id,
              resource_name: resolve2Data.Resources_Id[2].res_name,
              resourceType_Id: resolveData.ResTypes[0].ResType_Id,
              resourceType_actions: resolveData.ResTypes[0].Res_Action
            }
          ]
        },

        {
          policy_name: "Customer Policy",
          application_id: AppData._id,
          policy_type: "grant",
          polygrain: "Fine",
          policy_scope: "Protected",
          auth_ip: false,
          auth_time: false,
          auth_ip_start: "",
          auth_ip_end: "",
          auth_time_start: "",
          auth_time_end: "",
          policy_constrains: "",
          policy_principals: [
            {
              id: resolve2Data.Roles[0].role_id,
              type: "role",
              name: resolve2Data.Roles[0].role_name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[3].res_id,
              resource_name: resolve2Data.Resources_Id[3].res_name,
              resourceType_Id: resolveData.ResTypes[1].ResType_Id,
              resourceType_actions: resolveData.ResTypes[1].Res_Action
            }
          ]
        }
        ,
        {
          policy_name: "Discount Policy",
          application_id: AppData._id,
          policy_scope: "Protected",
          policy_type: "grant",
          policy_constrains: "#Min_discount == 5 && #Fast_moving == 5",
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
              resourceType_Id: resolveData.ResTypes[1].ResType_Id,
              resourceType_actions: resolveData.ResTypes[1].Res_Action
            }
          ]
        },

        {
          policy_name: "Shipping Policy",
          policy_scope: "Protected",
          application_id: AppData._id,
          policy_type: "grant",
          policy_constrains: "#Min_discount == 5",
          policy_principals: [
            {
              id: UserObj[1]._id,
              type: "user",
              name: UserObj[1].name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[1].res_id,
              resource_name: resolve2Data.Resources_Id[1].res_name,
              resourceType_Id: resolveData.ResTypes[1].ResType_Id,
              resourceType_actions: resolveData.ResTypes[1].Res_Action
            }
          ]
        },
        {
          policy_name: "Support Policy",
          application_id: AppData._id,
          policy_scope: "Protected",
          policy_type: "grant",
          policy_constrains: "",
          policy_principals: [
            {
              id: UserObj[6]._id,
              type: "user",
              name: UserObj[6].name
            }
          ],
          policy_targets: [
            {
              resource_id: resolve2Data.Resources_Id[1].res_id,
              resource_name: resolve2Data.Resources_Id[1].res_name,
              resourceType_Id: resolveData.ResTypes[1].ResType_Id,
              resourceType_actions: resolveData.ResTypes[1].Res_Action
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