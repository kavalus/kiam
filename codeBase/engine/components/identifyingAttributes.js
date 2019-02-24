const mongoose = require('mongoose');
const Attribute = require('../models/attribute_schema');
const Resource = require('../models/resource_schema');
var Fuse = require('fuse.js');
var hashTable = require('node-hashtable');


// load evaluatePolicy function
const EvaluatePolicyConstraint = require('./evaluatePolicy');

async function FindAttribute(attribute){
    let foundAttribute = await (Attribute.findOne({'Name': attribute},{Name: 1,_id: 1,Type: 1}, function(err, attribute) {
        if(err) console.log(err);
        
    }));
    return foundAttribute;
}

 async function FindResource(id,resname){
    let appid = hashTable.get('appid');
    let res = resname;
    let attr_id = id;
    console.log("Id23 : "+id)

  //console.log("val : " + appid._id + "--" + res + "--" + attr_id);
    let foundResource = await (Resource.findOne({'application_id':appid._id,'res_name':res,'attributes':{$elemMatch:{'attribute_id':id.toString()}}},{'attributes.$.attribute_value':1,'_id':0},function(err, result) {
        if(err) console.log(err);
        
    }));
    console.log("Found resource : "+foundResource);
    
    return foundResource;
}

async function checkAttributesInRequestObj(dynamicAttribute) {
  //check in reqObj
  var obj = hashTable.get('request');
//         let requestAttributeArray = [];
//                 for(var i=0;i<obj.resource.length;i++) {
//                      for(var j=0;j<obj.resource[i].resource_return_attributes.length;j++) {
//                         requestAttributeArray.push(obj.resource[i].resource_return_attributes[j]);
//                      }
//                 }
//                  var options = {
//                     keys:['attribute_name'],
//                     id: 'attribute_value'
//                  };
//                  var fuseSearch = new Fuse(requestAttributeArray,options);
//                  var attributeSearchResult = fuseSearch.search(dynamicAttribute);
//                 // console.log("Search Result  :" + dynamicAttribute  + " : "+ attributeSearchResult);
   // });
//return attributeSearchResult;
 return(obj[dynamicAttribute])
}

module.exports.getPolicyConstraintAttributes = async (policy,resname) => {
    if(policy == ( null || undefined || '')){
        return true
    }
    else{
        let resource =resname;
        var policyArray = [];
        var regexp = new RegExp('#([^\\s]*)', 'g');
        var policylist = policy.match(regexp);
        for (var p in policylist) {
            var hashSub = policylist[ p ].split('#');
            for (var x in hashSub) {
                if (hashSub[x] != "")
                {
                    if (hashSub[x].substr(hashSub[x].length - 1) == ":")
                    {
                        hashSub[x] = hashSub[x].slice(0, -1);
                    }
                    if (hashSub[x] != "") {
                        policyArray.push(hashSub[x]);
                    }
                }
            }
        }
        //Fetching values for each attribute in policyArray and checking their types
        var attributeArray = [];
        var attributeValueArray = [];
        for (let attribute of policyArray) {
                var attributeDetails = {"seed":"5"};
                attributeDetails = await FindAttribute(attribute);
                if(attributeDetails == null || attributeDetails == undefined){
                    console.log('Attribute not found in mongoDB');
                    let DynamicAttribute = {};
                    console.log("current Attribute => " + attribute);
                    if(await checkAttributesInRequestObj(attribute)!=null||attribute!=null) {
                        dynamicAttributeRequestValue = await checkAttributesInRequestObj(attribute);
                        if(dynamicAttributeRequestValue==null||dynamicAttributeRequestValue==''||dynamicAttributeRequestValue==[]||dynamicAttributeRequestValue==undefined) {
                            console.log('not found in request object.Trying to found in PIP');
                            if(await retrieveAttributesFromPIP(attribute)!=(null||undefined)) {
                                console.log("found in PIP") ;
                                dynamicAttributeRequestValue = await retrieveAttributesFromPIP(attribute);
                                DynamicAttribute["Name"] = attribute;
                                DynamicAttribute["Value"]= dynamicAttributeRequestValue;
                                attributeArray.push(DynamicAttribute);
                                attributeValueArray.push(dynamicAttributeRequestValue);
                            }
                           
                        }
                        else {
                            console.log('found in Request Object');
                            DynamicAttribute["Name"] = attribute;
                            DynamicAttribute["Value"]= dynamicAttributeRequestValue;
                            attributeArray.push(DynamicAttribute);
                            attributeValueArray.push(dynamicAttributeRequestValue)
                       }
                       
                    }
                    else  {
                        console.log("Attribute not found anywhere.")
                    }
    
                }else if(attributeDetails != null){
                    if(attributeDetails.Type=="Dynamic") {
                    let DynamicAttribute = {};
                   
                        dynamicAttributeValue = await checkAttributesInRequestObj(attributeDetails.Name);
                        if(dynamicAttributeValue==null||dynamicAttributeValue==''||dynamicAttributeValue==[]||dynamicAttributeValue==undefined) {
                            console.log('Attribute is defined in mongo as Dynamic, trying to find in PIP as not provided in Request Obj.');
                            dynamicAttributeRequestValue = await retrieveAttributesFromPIP(attribute);
                            DynamicAttribute["Name"] = attribute;
                            DynamicAttribute["Value"]= dynamicAttributeRequestValue;
                            attributeArray.push(DynamicAttribute);
                            attributeValueArray.push(dynamicAttributeRequestValue);
                        }
                        else {
                            console.log('Attribute is defined in mongo as Dynamic && value is provided in Request Obj.')
                            console.log("valv : "+attributeDetails.Name + dynamicAttributeValue);
                            DynamicAttribute["Name"] = attributeDetails.Name;
                            DynamicAttribute["Type"] = attributeDetails.Type;
                            DynamicAttribute["Value"]= dynamicAttributeValue;
                            attributeArray.push(DynamicAttribute);
                            attributeValueArray.push(dynamicAttributeValue)
                        }
                        
    
                   
                    }
                    else{
                        console.log('found in MongoDb');
                        let fixedAttributeValue = {};
                        fixedAttributeValue = await FindResource(attributeDetails._id,resource);
                        console.log(fixedAttributeValue);
                        console.log(fixedAttributeValue.attributes[0].attribute_value);
                        let FixedAttribute = {};
                        FixedAttribute["Name"] = attributeDetails.Name;
                        FixedAttribute["Type"] = attributeDetails.Type;
                        FixedAttribute["Value"] = fixedAttributeValue.attributes[0].attribute_value;
                        attributeArray.push(FixedAttribute);
                        attributeValueArray.push(fixedAttributeValue.attributes[0].attribute_value)
                        }
                }
        }
        console.log("attribute array : => "+attributeArray);
        console.log("Attribute value array => " + attributeValueArray);
         return EvaluatePolicyConstraint.evaluatePolicy(policy,attributeValueArray);
    }
    };

    

retrieveAttributesFromPIP = async (pipAttributesToBeFetched) => {
// Retrieve attributes here & fetch data from PIP database..
var attributeValue;
body = {
  "name": "getusersecuritycontextfull",
  "elements": [
    {"seed":"5",
      "userName": "AMUNSHI",
      "teammateId": "009272",
      "firstName1": "Amish",
      "lastName": "Munshi",
      "businessEntity": "Health Care",
      "titleEntitlementProfileName": null,
      "titleAbbreviation": null,
      "jobCode": null,
      "userType":"customer",
      "jobTitle": null,
      "Chin":'Hello',
      "jobDescription": null,
      "jobCodeWorkdayGroup": null,
      "titleLocations": null,
      "licenseLocations": null,
      "championLocations": null,
      "patientLocations": null,
      "supervisorTeammateId": "09876",
      "supervisorFirstName": "Ralph",
      "supervisorLastName": "Mitchell",
      "isClinical": false,
      "zeroAccessIndicator": 1,
      "f":21
    }
  ]
}
attributeValue =  body.elements[0][pipAttributesToBeFetched];
console.log("PIP called - " + pipAttributesToBeFetched+" : "+attributeValue);
return(attributeValue);
    };

exports.FindAttribute = FindAttribute;
exports.FindResource = FindResource;
exports.retrieveAttributesFromPIP = retrieveAttributesFromPIP;