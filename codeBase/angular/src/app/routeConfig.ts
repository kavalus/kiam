var link = "http://localhost:3001"

//------------------------------- dont chnge links below ----------------------

// embed links
var addr = link + "/api"
var usr = link + "/users"

//Applications
var Applications = addr + '/Applications/';
var application = addr + '/application/'
var addApp = addr + '/addApp'
var updateApp = addr + '/updateApp/'
var delApp = addr + '/delApp/'
var AppCoarse = addr + '/AppCoarse/'
var AppFine = addr + '/AppFine/'



var resourceTypes = addr + '/resourceTypes'
var resourceType = addr + '/resourceType/'
var addResourceType = addr + '/addResourceType'
var ResourceType_fetchByAppId = addr + '/ResourceType/fetchByAppId/'
var updateResourceType = addr + '/updateResourceType/'
var delResourceType = addr + '/delResourceType/'

var addAttribute = addr + '/attributes/addAttribute/';
var updateAttribute = addr + '/attributes/updateAttribute/';
var deleteAttribute = addr + '/attributes/deleteAttribute/';
var allAttributes = addr + '/attributes/allAttributes/';
var attributes_fetchByAppId = addr + '/attributes/fetchByAppId/';
var attributeById = addr + '/attributes/attributeById';
var filterAttributes = addr + '/attributes/filterAttributes';
var fetchByAppAndType = addr + '/attribute/fetchByAppAndType/';

var Roles = addr + '/role/Roles';
var role = addr + '/role/';
var addRole = addr + '/role/addRole';
var updateRole = addr + '/role/updateRole/';
var role_fetchByAppId = addr + '/role/fetchByAppId/';
var delRole = addr + '/role/delRole/';

var Fetch_Resource = addr + '/Fetch/Resource';
var addResource = addr + '/addResource';
var Resource = addr + '/Resource/';
var Resource_fetchByAppId = addr + '/Resource/fetchByAppId/';
var UpdateResource = addr + '/UpdateResource/';
var DeleteResource = addr + '/DeleteResource/';
var fetch_resource_url_protected = addr + '/Resource/fetchProtectedResources/';
var fetch_resource_url_public = addr + '/Resource/fetchPublicResources/'


var fetch_policy_url = addr + "/policies/fetchByAppId/"; //feched by app id
var fetch_roles_url = addr + "/role/fetchByAppId/"; //feched by app id
var fetch_users_url = addr + "/users/all"; 
var fetch_resource_url = addr + "/Resource/fetchByAppId/"; //feched by app id
var fetch_policyById_url = addr + "/policy/";
var add_policy_url = addr + "/addPolicy";
var add_targets_url = addr + "/addTargets"
var update_policy_url = addr + "/updatePolicy";
var delete_policy_url = addr + "/delPolicy/";
var get_res_type_actions_url = addr + "/policy/res_type_actions/";
var fetch_policy_url_public = addr + "/policy/fetchPublicPolicy/"



var user_Add = addr + '/user/Add';
var users_all = addr + '/users/all';
var user = addr + '/user/';
var UpdateUser = addr + '/UpdateUser/';
var DelUser = addr + '/DelUser/';
var users_admin = addr + '/users/admin';


var connectLDAP = link + '/connectLDAP';
var CheckPara = link + '/connectLDAP/Authenticate';
var GetLDAPConfiguration = link + '/configure/GetConfig';
var SetLDAPConfiguration = link + '/configure/SetConfig';

var authenticate = usr + '/authenticate';
var ForgotPassword = usr + '/ForgotPassword';
var ForgotPassword_id_token = usr + '/ForgotPassword/:id/:token';
var ChangePassword = usr + '/ChangePassword';

export {addr, 

Applications,application,addApp,updateApp,delApp,AppFine,AppCoarse,

resourceTypes,resourceType,ResourceType_fetchByAppId,updateResourceType,delResourceType,addResourceType,

addAttribute,updateAttribute,deleteAttribute,allAttributes,attributes_fetchByAppId,attributeById,filterAttributes,fetchByAppAndType,

Roles,role,addRole,updateRole,role_fetchByAppId,delRole,

Fetch_Resource,addResource,Resource,Resource_fetchByAppId,UpdateResource,DeleteResource,

fetch_policy_url,fetch_roles_url,fetch_users_url,fetch_resource_url,fetch_policyById_url,add_policy_url,add_targets_url,update_policy_url,delete_policy_url,get_res_type_actions_url,fetch_resource_url_protected, fetch_resource_url_public, fetch_policy_url_public,

user_Add,users_all,user,UpdateUser,DelUser,users_admin,

authenticate,ForgotPassword,ForgotPassword_id_token,ChangePassword,

connectLDAP,GetLDAPConfiguration,SetLDAPConfiguration,CheckPara
};