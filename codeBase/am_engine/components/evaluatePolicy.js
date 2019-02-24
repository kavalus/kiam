
function evaluatePolicy(policyConstraint, attributeArray) {
    
    console.log("Array = > " + attributeArray);
    var reg = new RegExp('#([^\\s]*)', 'g');
    console.log("constraint : " + policyConstraint);
    const splitArray = policyConstraint.split(' ');
    var i = 0;
    splitArray.forEach(function(element) {
        if(element.match(reg)) {
          var attributeValue;
          console.log("value to replace : "+element+" => "+attributeArray[i])
          if (isNaN(attributeArray[i])) {
              attributeValue = "'" + attributeArray[i] + "'";
          }
          else if (!isNaN(attributeArray[i])) {
              attributeValue = attributeArray[i];
          }
          else {
              console.log("Attribute value not defined");
              attributeValue = "null";
          } 
          splitArray[splitArray.indexOf(element)] = attributeValue;
          policyConstraint.replace(splitArray[0],attributeArray[i]);
          i++;
        }
        
    });
    var joinArray = splitArray.join(' ');
    console.log('new Constraint : ' + joinArray)
    if(eval(joinArray)) {
    //    resolve(true)
        return true;
    }
    else {
       console.log("constraint is false");
          return false;
    }
}

exports.evaluatePolicy = evaluatePolicy;