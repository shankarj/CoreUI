/**
 * Created by PA_VSridha on 9/16/2016.
 */

var nElementType = null;
var nLeftConnections = null;
var nRightConnections = null;
var nTopConnections = null;
var nBottomConnections = null;

var Deploy = function (type, nL, nR, nT) {
    console.log('reached')
    nElementType = type;
};

Deploy.prototype.getType = function () {
    console.log(nElementType)
}

/*
var elementsList = {
    "e001": {
        "props":["prop1", "prop2"],
        "init":{
            "prop1": 7
        },
        "prop_interfaces": {
            "prop1": ["expected_prop1", "expected_prop2"]
        },
        "elementObject": {
            "topCircleObject": OBJECT,
            "leftCircleObject": ,
            "mainObject": ,
            ...
    },
    "connectionObjects":["connection1", "connection2"]
}
}

var connectionsList = {
    "connection1": {
        "fromElement" : "e001",
        "toElement" : "e002",
        "connectionObject" : ACTUAL PAPER JS OBJECT,
        "propMappings": {
            "c001":{
                "from_prop": "something",
                "to_prop": "something"
            },
            "c002":{
                "from_prop": "something",
                "to_prop": "something"
            }
        }
    }
}
*/

