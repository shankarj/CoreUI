function drawCircleElement(paperObject, color, groupId){
     var mainCircle = new paperObject.Path.Circle({
                name: "core-" + groupId, 
                center: paperObject.view.center,
                radius: 30,
                fillColor: color
            });

    mainCircle.bringToFront();

    var connectorPointRight = new paperObject.Point(mainCircle.position.x + (mainCircle.bounds.width/2), mainCircle.position.y);
    var connectorPointLeft = new paperObject.Point(mainCircle.position.x - (mainCircle.bounds.width/2), mainCircle.position.y);

    var connectorLeft = new paperObject.Path.Circle({
        name: "left-" + groupId,
        center: connectorPointLeft,
        radius: 5,
        fillColor: 'blue',
        
    });

    var connectorRight = new paperObject.Path.Circle({
        name: "right-" + groupId,
        center: connectorPointRight,
        radius: 5,
        fillColor: 'blue',
    });

    connectorLeft.bringToFront();
    connectorRight.bringToFront();
    return [mainCircle, connectorLeft, connectorRight];           
}

function getGroupOfElement(groupList, elementId){
    for (var groupName in groupList){
        var elemObj = groupList[groupName]["object"].children[elementId];
        if (elemObj != undefined){
            return groupName;
        }
    }
}