function drawCircleElement(paperObject, color, groupId) {

    var mainCircle = new paperObject.Path.Circle({
        name: "core-" + groupId,

        center: paperObject.view.center,
        radius: circleElementRadius,
        fillColor: color
    });


    mainCircle.bringToFront();

    var connectorPointRight = new paperObject.Point(mainCircle.position.x + (mainCircle.bounds.width / 2), mainCircle.position.y);
    var connectorPointLeft = new paperObject.Point(mainCircle.position.x - (mainCircle.bounds.width / 2), mainCircle.position.y);

    var connectorLeft = new paperObject.Path.Circle({
        name: "left-" + groupId,
        center: connectorPointLeft,
        radius: connectorCircleRadius,
        fillColor: connectorCircleColor,
        strokeColor: connectorCircleStrokeColor,
        strokeWidth: connectorCircleStrokeWidth
    });

    var connectorRight = new paperObject.Path.Circle({
        name: "right-" + groupId,
        center: connectorPointRight,
        radius: connectorCircleRadius,
        fillColor: connectorCircleColor,
        strokeColor: connectorCircleStrokeColor,
        strokeWidth: connectorCircleStrokeWidth
    });

    connectorLeft.bringToFront();
    connectorRight.bringToFront();
    return [mainCircle, connectorLeft, connectorRight];
}

function drawRoundedRectElement(paperObject, color, groupId) {

    var rectangle = new paperObject.Rectangle(paperObject.view.center, new paperObject.Point(paperObject.view.center.x + 180, paperObject.view.center.y + 50));
    var cornerSize = new paperObject.Size(10, 10);
    var mainRect = new paperObject.Path.RoundRectangle(rectangle, cornerSize);

    mainRect.name = "core-" + groupId;


    mainRect.style = {
        fillColor: color,
        strokeWidth: 2,
        strokeColor: 'lightgray'

    }
    mainRect.bringToFront();

    var connectorPointRight = new paperObject.Point(mainRect.position.x + (mainRect.bounds.width / 2), mainRect.position.y);
    var connectorPointLeft = new paperObject.Point(mainRect.position.x - (mainRect.bounds.width / 2), mainRect.position.y);

    var connectorLeft = new paperObject.Path.Circle({
        name: "left-" + groupId,
        center: connectorPointLeft,
        radius: connectorCircleRadius,
        fillColor: connectorCircleColor,
        strokeColor: connectorCircleStrokeColor,
        strokeWidth: connectorCircleStrokeWidth
    });

    var connectorRight = new paperObject.Path.Circle({
        name: "right-" + groupId,
        center: connectorPointRight,
        radius: connectorCircleRadius,
        fillColor: connectorCircleColor,
        strokeColor: connectorCircleStrokeColor,
        strokeWidth: connectorCircleStrokeWidth

    });
    var connectorPointTop = new paperObject.Point(mainRect.position.x, mainRect.position.y - (mainRect.bounds.height / 2));

    var connectorTop = new paperObject.Path.Circle({
        name: "top-" + groupId,
        center: connectorPointTop,
        radius: connectorCircleRadius,
        fillColor: connectorPropertyCircleColor,
        strokeColor: connectorPropertyCircleStrokeColor,
        strokeWidth: connectorCircleStrokeWidth
    });


    connectorLeft.bringToFront();
    connectorRight.bringToFront();
    return [mainRect, connectorLeft, connectorRight, connectorTop];
}

function drawPropertyElement(paperObject, color, groupId) {

    var rectangle = new paperObject.Rectangle(paperObject.view.center, new paperObject.Point(paperObject.view.center.x + 50, paperObject.view.center.y + 50));
    var cornerSize = new paperObject.Size(5, 5);
    var mainRect = new paperObject.Path.RoundRectangle(rectangle, cornerSize);

    mainRect.name = "core-" + groupId;


    mainRect.style = {
        fillColor: color,
        strokeWidth: 2,
        strokeColor: 'lightgray'

    }
    mainRect.bringToFront();


    var connectorPointBottom = new paperObject.Point(mainRect.position.x, mainRect.position.y + (mainRect.bounds.height / 2));

    var connectorBottom = new paperObject.Path.Circle({
        name: "bottom-" + groupId,
        center: connectorPointBottom,
        radius: connectorCircleRadius,
        fillColor: connectorPropertyCircleColor,
        strokeColor: connectorPropertyCircleStrokeColor,
        strokeWidth: connectorCircleStrokeWidth
    });


    return [mainRect, connectorBottom];
}

function getGroupOfElement(groupList, elementId) {
    for (var groupName in groupList) {
        var elemObj = groupList[groupName]["object"].children[elementId];
        if (elemObj != undefined) {
            return groupName;
        }
    }
}



