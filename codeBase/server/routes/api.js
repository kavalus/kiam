const express = require('express');

var bcrypt = require('bcrypt-nodejs');
const router = express.Router();
var store_password;


// bring in the model
const App = require('../models/app_schema');
const ResourceType = require('../models/resourceType_schema');
const Attribute = require('../models/attribute_schema');
const Role = require('../models/role_schema');
const Resource = require('../models/resource_schema');
const Policy = require('../models/policy_schema');
const User = require('../models/user_schema');


//------------------------------------------------Application------------------------------------------------------------------------

//Application API

// fetch All Apps
router.get('/Applications', (req, res, next) => {
  App.find({}, function (err, apps) {
    if (err) res.json(err);
    res.json(apps);
  });
});

router.get('/AppCoarse', (req, res, next) => {
  App.find({ "app_type": "Coarse" }, function (err, apps) {
    if (err) res.json(err);
    res.json(apps);
    // console.log(res, 'this is response from Course')
  });

});

router.get('/AppFine', (req, res, next) => {
  App.find({ "app_type": "Fine" }, function (err, apps) {
    if (err) res.json(err);
    res.json(apps);
    // console.log(res, 'this is response from Course')
  });
});



//fetch single app by id:
router.get('/application/:id', (req, res, next) => {
  App.findById({ _id: req.params.id }, (err, app) => {
    if (err) { res.json(err); }
    res.json(app);
  });
});

//Add App
router.post('/addApp', (req, res, next) => {
  let newApp = new App({
    app_name: req.body.app_name,
    app_displayname: req.body.app_displayname,
    app_description: req.body.app_description,
    app_type: req.body.app_type,
  });
  newApp.save((err, createdObj) => {
    if (err) res.status(500).send('Application is already Exist..!');
    else if (createdObj.length != 0) res.status(200).send(createdObj);
    else res.status(500).send('Application is already Exist..!');
  })
});

//edit App
router.put('/updateApp/:id', (req, res, next) => {
  var id = req.params.id;
  let editedApp = new App({
    app_name: req.body.app_name,
    app_displayname: req.body.app_displayname,
    app_description: req.body.app_description,
    app_type: req.body.app_type,
  });
  App.update({ _id: id }, { $set: req.body }, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(result);
  });
})

//Delete App
router.delete('/delApp/:id', (req, res, next) => {
  Policy.find({ application_id: req.params.id }).count((err, data) => {

    if (data == 0) {
      App.findByIdAndRemove({ _id: req.params.id }, function (err, docs) {
        if (err) { res.sendStatus(403); }
        else { res.sendStatus(200); }
      });
    }
    else {
      res.status(403).send("used");
    }
  })

});


//------------------------------------------------ResorceType------------------------------------------------------------------------
//ResorceType API

router.get('/resourceTypes', (req, res, next) => {
  ResourceType.find({}, function (err, resourceTypes) {
    if (err) res.json(err);
    res.json(resourceTypes);
  });
});

//fetch single rt by id:
router.get('/resourceType/:id', (req, res, next) => {
  ResourceType.findById({ _id: req.params.id }, (err, resourceType) => {
    if (err) { res.json(err); }
    else { res.json(resourceType); }
  });
});





//Add rt
router.post('/addResourceType', (req, res, next) => {

  ResourceType.find({ resourceType_name: req.body.resourceType_name }).where('application_id').equals(req.body.application_id).count((err, data) => {
    if (data == 0) {

      let actions = [];
      let newResourceType = new ResourceType({
        resourceType_name: req.body.resourceType_name,
        resourceType_displayname: req.body.resourceType_displayname,
        resourceType_description: req.body.resourceType_description,
        application_id: req.body.application_id,
        resourceType_type: req.body.resourceType_type,
        resourceType_actions: req.body.resourceType_actions,

      });
      newResourceType.save((err, createdObj) => {
        if (err) res.status(500).json({ Error: "Not working" });
        else res.status(200).send(createdObj);
      })
    }
    else {
      res.status(500).send("unique");

    }
  });
});

//fetch by app_id
router.get('/ResourceType/fetchByAppId/:app_id', (req, res, next) => {
  ResourceType.find({ application_id: req.params.app_id }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

//edit rt
router.put('/updateResourceType/:id', (req, res, next) => {
  var id = req.params.id;
  let editedResourceType = new ResourceType({
    resourceType_name: req.body.resourceType_name,
    resourceType_displayname: req.body.resourceType_displayname,
    resourceType_description: req.body.resourceType_description,
    resourceType_type: req.body.resourceType_type,

  });
  ResourceType.update({ _id: id }, { $set: req.body }, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(result);
  });
})

//Delete rt
router.delete('/delResourceType/:id', (req, res, next) => {

  Resource.find({ Resource_typeid: req.params.id }).count((err, data) => {
    console.log(data);
    if (data == 0) {

      ResourceType.findByIdAndRemove({ _id: req.params.id },
        function (err, docs) {
          if (err) { res.sendStatus(403); }
          else { res.sendStatus(200); }
        });
    }
    else {
      res.send("used");
    }

  });

});

//------------------------------------------------Attributes------------------------------------------------------------------------

//#region  Add, Edit, Delete & Fetch Attributes

//attribute by type : fixed
router.get('/attribute/fetchByAppAndType/:app_id', (req, res, next) => {
  Attribute.find({ Application_Id: req.params.app_id, Type: 'Fixed' }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

// Add Attribute
router.post('/attributes/addAttribute', (req, res, next) => {


  Attribute.find({ 'Name': req.body.Name }).where('Application_Id').equals(req.body.Application_Id).count((err, data) => {
    if (data == 0) {

      let newAttribute = new Attribute({
        Name: req.body.Name,
        Type: req.body.Type,
        DataType: req.body.DataType,
        Description: req.body.Description,
        Application_Id: req.body.Application_Id,
        Single_Multiple: req.body.Single_Multiple
      });


      newAttribute.save((err, attribute) => {

        if (err) res.status(500).send(err);
        else res.status(200).send(attribute);
      })
    }
    else {
      res.status(500).send("unique");
    }
  });

});

//edit Attribute
router.put('/attributes/updateAttribute', (req, res, next) => {
  Attribute.findByIdAndUpdate({ _id: req.body._id }, { $set: req.body }, { new: true }, (err, attribute) => {
    if (err) { res.status(500).json({ Error: err["errmsg"] }); console.log(err); }
    else if (attribute == null) { res.status(500).json({ success: false, msg: 'Attribute Not Found' }); }
    else { res.status(200).json({ success: true, Attribute: attribute }); }
  });
});



//Delete Attribute
router.delete('/attributes/deleteAttribute/:id', (req, res, next) => {

  Resource.find({ attributes: { $elemMatch: { attribute_id: req.params.id } } }).count((err, data) => {

    if (data == 0) {

      Attribute.findByIdAndRemove({ _id: req.params.id },
        function (err, docs) {
          if (err) { res.sendStatus(403); }
          else { res.sendStatus(200); }
        });
    }
    else {
      res.send("used");
    }
  })

});

// fetch Attributes
router.get('/attributes/allAttributes', (req, res, next) => {
  Attribute.find({}, function (err, attributes) {
    if (err) { res.status(500).json({ Error: err["errmsg"] }); }
    else { res.status(200).json({ success: true, Attributes: attributes }); }
  });
});

//fetch by app_id
router.get('/attributes/fetchByAppId/:app_id', (req, res, next) => {
  Attribute.find({ Application_Id: req.params.app_id }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

//fetch Attribute by ID
router.get('/attributes/attributeById', (req, res, next) => {
  Attribute.findById({ _id: req.query._id }, (err, attribute) => {
    if (err) { res.status(500).json({ Error: err["errmsg"] }); }
    else if (attribute == null) { res.status(404).json({ success: false, msg: 'Attribute Not Found' }); }
    else { res.status(200).json({ success: true, Attribute: attribute }); }
  });
});

//#endregion


//------------------------------------------------Roles------------------------------------------------------------------------

//fetch All Role
router.get('/role/Roles', (req, res, next) => {
  Role.find({}, function (err, apps) {
    if (err) res.json(err);
    res.json(apps);
  });
});

//fetch single role by id:
router.get('/role/:id', (req, res, next) => {
  Role.findById({ _id: req.params.id }, (err, app) => {
    if (err) { res.json(err); }
    res.json(app);
  });
});

//Add Role
router.post('/role/addRole', (req, res, next) => {
  Role.find({ Role_name: req.body.Role_name }).where('Application_id').equals(req.body.Application_id).count((err, data) => {
    if (data == 0) {

      let newRole = new Role({
        Role_name: req.body.Role_name,
        Application_id: req.body.Application_id,
      });
      newRole.save((err, createdObj) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(createdObj);
      })
    }
    else {
      res.status(500).send("unique");
    }
  });

});

//edit Role
router.put('/role/updateRole/:id', (req, res, next) => {
  var id = req.params.id;
  let editedRole = new Role({
    Role_name: req.body.Role_name,
    Application_id: req.body.Application_id
  });
  Role.update({ _id: id }, { $set: req.body }, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(result);
  });
})
//fetch by appid
router.get('/role/fetchByAppId/:app_id', (req, res, next) => {
  Role.find({ Application_id: req.params.app_id }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

//Delete Role
router.delete('/role/delRole/:id', (req, res, next) => {
  Role.findByIdAndRemove({ _id: req.params.id },
    function (err, docs) {
      if (err) { res.sendStatus(403); }
      else { res.sendStatus(200); }
    });
});


// ---------------------------------------Resources-------------------------------------------------------------------

//fetch All Resource
router.get('/Fetch/Resource', (req, res, next) => {
  Resource.find({}, function (err, apps) {
    if (err) res.json(err);
    res.json(apps);
  });
});

//Add App
router.post('/addResource', (req, res, next) => {
  Resource.find({ res_name: req.body.res_name }).where('application_id').equals(req.body.application_id).count((err, data) => {
    if (data == 0) {
      let newApp = new Resource({
        res_name: req.body.res_name,
        res_displayname: req.body.res_displayname,
        res_description: req.body.res_description,
        Resource_typeid: req.body.Resource_typeid,
        grain: req.body.grain,
        attributes: req.body.attributes,
        attribute_value: req.body.attribute_value,
        application_id: req.body.application_id,
        Authentication_type: req.body.Authentication_type,
        Protection_type: req.body.Protection_type,
        Protocol_type: req.body.Protocol_type,
        url: req.body.url,
      });

      newApp.save((err, createdObj) => {
        if (err) res.status(500).json({ Error: 'Not Working.' });
        else res.status(200).json(createdObj);
      })
    }
    else {
      res.status(500).send("unique");
    }
  });

});

//fetch single app by id:
router.get('/Resource/:id', (req, res, next) => {
  Resource.findById({ _id: req.params.id }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

//fetch by app_id
router.get('/Resource/fetchByAppId/:app_id', (req, res, next) => {
  Resource.find({ application_id: req.params.app_id }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

router.get('/Resource/fetchPublicResources/:app_id', (req, res, next) => {
  Resource.find({ application_id: req.params.app_id, Protection_type: "Public" }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

router.get('/Resource/fetchProtectedResources/:app_id', (req, res, next) => {
  Resource.find({ application_id: req.params.app_id, Protection_type: "Protected" }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});


//edit App
router.put('/UpdateResource/:id', (req, res, next) => {
  // console.log(res, 'this is Response')
  var id = req.params.id;
  let editedApp = new Resource({
    res_name: req.body.res_name,
    res_displayname: req.body.res_displayname,
    res_description: req.body.res_description,
    resourceType_type: req.body.resourceType_type,
    Resource_typeid: req.body.Resource_typeid,
    grain: req.body.grain,
    attributes: req.body.attributes,
    attribute_value: req.body.attribute_value,
    application_id: req.body.application_id,
    Authentication_type: req.body.Authentication_type,
    Protection_type: req.body.Protection_type,
    Protocol_type: req.body.Protocol_type,
    url: req.body.url,
  });
  // console.log(editedApp, 'this is updated app')
  Resource.update({ _id: id }, { $set: req.body }, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(result);
  });
})

//Delete App
router.delete('/DeleteResource/:id', (req, res, next) => {
  // var id = req.params.id;     //line added

  Policy.find({ policy_targets: { $elemMatch: { resource_id: req.params.id } } }).count((err, data) => {
    console.log(data);
    if (data == 0) {
      Resource.findByIdAndRemove({ _id: req.params.id },
        function (err, docs) {
          if (err) { res.sendStatus(403); }
          else { res.sendStatus(200); }
        });
    }
    else {
      res.status(403).send("used");
    }
  })
});


//------------------------------------------Policies--------------------------------------------------------


//fetch All policies
router.get('/policies', (req, res, next) => {
  Policy.find({}, function (err, apps) {
    if (err) res.json(err);
    res.json(apps);
  });
});

//fetch by app_id
router.get('/policies/fetchByAppId/:app_id', (req, res, next) => {
  Policy.find({ application_id: req.params.app_id }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});

//fetch single Policy by id:
router.get('/policy/:id', (req, res, next) => {
  Policy.findById({ _id: req.params.id }, (err, app) => {
    if (err) { res.json(err); }
    res.json(app);
  });
});

//fetch policy by app_id
router.get('/Policy/fetchByAppId/:app_id', (req, res, next) => {
  Policy.find({ application_id: req.params.app_id }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }
  });
});
router.get('/policy/fetchPublicPolicy/:app_id', (req, res, next) => {
  Policy.find({ application_id: req.params.app_id, policy_scope: "Public" }, (err, app) => {
    if (err) { res.json(err); }
    else { res.json(app); }

  });
});

//Add Policy
router.post('/addPolicy', (req, res, next) => {
  Policy.find({ policy_name: req.body.policy_name }).where('application_id').equals(req.body.application_id).count((err, data) => {
    if (data == 0) {
      let newPolicy = new Policy({
        policy_name: req.body.policy_name,
        application_id: req.body.application_id,
        policy_type: req.body.policy_type,
        policy_constrains: req.body.policy_constrains,
        policy_principals: req.body.policy_principals,
        auth_ip: req.body.auth_ip,
        auth_time: req.body.auth_time,
        auth_ip_start: req.body.auth_ip_start,
        auth_ip_end: req.body.auth_ip_end,
        auth_time_start: req.body.auth_time_start,
        auth_time_end: req.body.auth_time_end,
        alloted_days: req.body.alloted_days,
        polygrain: req.body.polygrain,
        policy_response: req.body.policy_response,
        policy_scope: req.body.policy_scope


      });
      newPolicy.save((err, createdObj) => {
        if (err) { console.log(err); }
        else { addTargets(createdObj) };
      })

      function addTargets(policy) {
        for (let i = 0; i < req.body.policy_targets.length; i++) {
          if (req.body.policy_targets[i].resource_id === undefined) { console.log("resource id is not proper") }
          else {
            Resource.findById({ _id: req.body.policy_targets[i].resource_id }, (err, reso) => {
              if (err) { console.log(err) }
              else {
                ResourceType.findById({ _id: reso.Resource_typeid }, (err, resotype) => {
                  if (reso._id != (undefined || null) && resotype._id != (undefined || null)) {
                    let policytargetobj = {
                      resource_id: reso._id,
                      resource_name: reso.res_name,
                      resourceType_Id: resotype._id,
                      resourceType_actions: resotype.resourceType_actions
                    }
                    Policy.updateOne({ "_id": policy._id },
                      {
                        $push: { "policy_targets": policytargetobj }
                      },
                      (err, result) => { if (err) { console.log(err); } else { console.log(result) } })
                  }
                  else {
                    console.log({ "message": "resource" })
                  }
                })
              }
            })
          }
        }
        res.status(200).send({ "message": "ok", "data": newPolicy });
        console.log('policy created');
      }
    }
    else {
      res.status(500).json({ "message": "unique" });
    }
  });
});

// edit Policy
router.put('/updatePolicy/', (req, res, next) => {
  let updPolicy = new Policy({
    policy_name: req.body.policy_name,
    application_id: req.body.application_id,
    policy_type: req.body.policy_type,
    policy_constrains: req.body.policy_constrains,
    policy_principals: req.body.policy_principals,
    auth_ip: req.body.auth_ip,
    auth_time: req.body.auth_time,
    auth_ip_start: req.body.auth_ip_start,
    auth_ip_end: req.body.auth_ip_end,
    auth_time_start: req.body.auth_time_start,
    auth_time_end: req.body.auth_time_end,
    alloted_days: req.body.alloted_days,
    polygrain: req.body.polygrain,
    policy_response: req.body.policy_response,
    policy_scope: req.body.policy_scope

  });

  Policy.deleteOne({ '_id': req.body._id }, (err, r) => {
    if (err) { console.log(err); }
    else {
      updPolicy.save((err, createdObj) => {
        if (err) { console.log(err); }
        else {
          // res.send({"message":"ok"});
          res.send({ createdObj });
          addTargets(createdObj)
        };
      })
    };
  });

  function addTargets(policy) {
    for (let i = 0; i < req.body.policy_targets.length; i++) {
      if (req.body.policy_targets[i].resource_id === undefined) { console.log("resource id is not proper") }
      else {
        Resource.findById({ _id: req.body.policy_targets[i].resource_id }, (err, reso) => {
          if (err) { console.log(err) }
          else {
            ResourceType.findById({ _id: reso.Resource_typeid }, (err, resotype) => {
              if (reso._id != (undefined || null) && resotype._id != (undefined || null)) {
                let policytargetobj = {
                  resource_id: reso._id,
                  resource_name: reso.res_name,
                  resourceType_Id: resotype._id,
                  resourceType_actions: resotype.resourceType_actions,
                  grai: resotype.grain
                }
                if (req.body.policy_targets[i].resourceType_actions != undefined) {
                  policytargetobj.resourceType_actions = req.body.policy_targets[i].resourceType_actions;
                }
                Policy.updateOne({ "_id": policy._id },
                  {
                    $push: { "policy_targets": policytargetobj }

                  },
                  (err, result) => { if (err) { console.log(err); } else { console.log(result) } })
              }
              else {
                console.log({ "message": "resource" })
              }
            })
          }
        })
      }
    }
  }

})

//restypeactions
router.get('/policy/res_type_actions/:id', (req, res, next) => {
  Policy.findOne({ 'policy_targets.resourceType_Id': req.params.id }, { 'policy_targets.resourceType_actions.$': 1 }, (err, respo) => {
    if (err) { console.log(err) }
    else { res.json(respo); }
  })
})

//add Policy Target Actions
router.put('/addTargets', (req, res, next) => {
  if (req.body != '') {
    Policy.update(
      { '_id': req.body.policyid },
      { $set: { 'policy_targets.$[i].resourceType_actions.$[j].action_state': req.body.state } },
      { arrayFilters: [{ 'i.resource_id': req.body.resource_id }, { 'j.action_name': req.body.name }] }, (err, ress) => {
        if (err) console.log(err)
        else if (ress.nModified === 1) res.status(200).json({ 'success': true });
      }
    )
    // res.status(200).json({'success':true});
  }
})

//Delete Policy
router.delete('/delPolicy/:id', (req, res, next) => {
  Policy.findByIdAndRemove({ _id: req.params.id },
    function (err, docs) {
      if (err) { res.sendStatus(403); }
      else { res.sendStatus(200); }
    });
});



//end region policy

//----------------------------------------------Admin Users-------------------------------------------------------------

//Add user
router.post('/user/Add', (req, res, next) => {

  let NewUser = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
    user_type: req.body.user_type,
    // mobile_no: req.body.mobile_no
  });
  User.addUser(NewUser, (err, user) => {
    if (err) {
      res.status(500).json({ success: false, msg: 'Failed to register user' });
    } else {
      res.status(200).json({ success: true, msg: 'User registered', data: user });
    }
  });
});
router.get('/Resource/fetchByurl/:app_id/:url', (req, res, next) => {
  Resource.find({ application_id: req.params.app_id, url: req.params.url }, (err, app) => {
    if (err) { res.json(err); }
    else {
      res.json(app);
    }
  })
}
);
//fetch All users
router.get('/users/all', (req, res, next) => {
  User.find({}, function (err, users) {
    if (err) res.json(err);
    res.json(users);
  });
});

router.get('/users/admin', (req, res, next) => {
  User.find({ "username": "admin" }, function (err, users) {
    if (err) res.json(err);
    res.json(users);
  });
});

//fetch single user by id:
router.get('/user/:id', (req, res, next) => {
  User.findById({ _id: req.params.id }, (err, user) => {
    if (err) { res.json(err); }
    res.json(user);
    console.log(user,"lllllllllllllllllllllllllllll")
  });
});

//edit user
router.put('/UpdateUser/:id', (req, res, next) => {
  var id = req.params.id;

  User.UpdateUser(id, req.body, (err, user) => {
    if (err) {
      res.status(500).json({ success: false, msg: 'Failed to register user' });
    } else {
      res.status(200).json({ success: true, msg: 'User registered' });
    }
  });
});

//Delete user
router.delete('/DelUser/:id', (req, res, next) => {
  User.findByIdAndRemove({ _id: req.params.id },
    function (err, docs) {
      if (err) { res.sendStatus(403); }
      else { res.sendStatus(200); }
    });
});


// router.get('/user/system/:id', (req, res, next) => {
//   User.findById({ _id: req.params.id }, (err, user) => {
//     if (err) { res.json(err); }
//     else {
//       res.json(user);
//       // User.find({"user_type":"system"}, function (err, users) {
//       //   if (err) res.json(err);
//       //   res.json(users);
//       // });
//     }
//   });
// });


// router.get('/system', (req, res, next) => {
//   User.find({"username":"A"}, function (err, users) {
//     if (err) res.json(err);
//     res.json(users[0].user_type);
//   });
// });



module.exports = router;



