// View related variables
var viewWidth = view.bounds.width;
var viewHeight = view.bounds.height;
var viewStartX = view.bounds.x;
var viewStartY = view.bounds.y;
var viewCenter = view.bounds.center;
var startingViewCenter = view.bounds.center;
var mousePoint = 0;
var selectedConnection = null;
var doConnect = false;

// Canvas Object event inits.
var canvasObject = document.getElementById("networkCanvas");
canvasObject.addEventListener("mousewheel", zoomCanvasHandler, false); // For IE, Chrome
canvasObject.addEventListener("DOMMouseScroll", zoomCanvasHandler, false); // For Firefox

// Network structure
var networkElements = {};
var connectionObjects = {};

/*
* Canvas events
*/
function onResize(event) {
	viewWidth = view.bounds.width;
    viewHeight = view.bounds.height;
    viewStartX = view.bounds.x;
    viewStartY = view.bounds.y;
    viewCenter = view.bounds.center;
}

function onClick(event){
    console.log("yo");
}

function onMouseMove(event) {
    mousePoint = event.point;
}

function onMouseUp(event){
    if (doConnect){
        currConnectionObject.remove();
        currConnectionObject = null;
        doConnect = false;
    }
}

function zoomCanvasHandler(e) { 
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    var oldZoom = view.zoom;
    var newZoom = view.zoom + (delta / zoomFactor);

    if (newZoom < 1){
        view.zoom = 1;
        view.center = startingViewCenter;
    }else if (newZoom > 10){
        view.zoom = 10;
    }else{
        if ((view.zoom >= 1) && (view.zoom <= 10)){
            view.zoom = newZoom;
        }
        var zoomRatio = oldZoom / newZoom;
        var scaleDiff = mousePoint - view.center;
        var offset = mousePoint - (scaleDiff  * zoomRatio) - view.center;
        view.center += offset;
    }
}

/*
* Drawing grid lines.
*/
function drawGridLines(){
    for(var i=0;i<=viewHeight;i=i+gridSize){
        var horLine = new Path();
        horLine.strokeColor = 'gray';
        horLine.opacity = 0.1;
        horLine.add(new Point(0, i), new Point(viewWidth, i));
    }

    for(var i=0;i<=viewWidth;i=i+gridSize){
        var verLine = new Path();
        verLine.strokeColor = 'gray';
        verLine.opacity = 0.1;
        verLine.add(new Point(i, 0), new Point(i, viewHeight));
    }
}


/*
* --------------------------------------
* Main function to draw a given element type. Renders element on canvas and
* stores it in the global dictionary.
* --------------------------------------
*/ 
var startPoint = null;
var endPoint = null;
var handleOut = null;
var handleIn = null;
var currConnectionObject = null;
var connStartElement = null;
var connEndElement = null;

function renderConnection(startPoint, endPoint, isUpdate, connObject, color, thickness){
    var helperRect = new Rectangle(startPoint, endPoint);

    if (startPoint.y < endPoint.y){
        handleOut = helperRect.topCenter - startPoint;
        handleIn = helperRect.bottomCenter - endPoint;
    }else{
        handleOut = helperRect.bottomCenter - startPoint;
        handleIn = helperRect.topCenter - endPoint;
    }

    if (!isUpdate){
        var connSeg1 = new Segment(startPoint, null, handleOut);
        var connSeg2 = new Segment(endPoint, handleIn, null);
        var connectionObject = new Path(connSeg1, connSeg2);
        connectionObject.strokeColor = color;
        connectionObject.strokeWidth = thickness;
        connectionObject.sendToBack();
        return connectionObject;
    }else{
        connObject.segments[1].point = endPoint;
        connObject.segments[0].point = startPoint;
        connObject.segments[0].handleOut = handleOut;
        connObject.segments[1].handleIn = handleIn;
    }
    delete helperRect;
}

function createConnection(connId, connObject, startElement, endElement, connDirection){
    connectionObjects[connId] = {};
    connObject.name = connId;
    connectionObjects[connId]["object"] = connObject;
    connectionObjects[connId]["start"] = startElement;
    connectionObjects[connId]["end"] = endElement;
    connectionObjects[connId]["direction"] = connDirection;
    addConnectionToGroup(connId, startElement, endElement, connDirection);
}

function addConnectionToGroup(connId, startElement, endElement, direction){
    if (direction === "forward"){
        networkElements[startElement]["right"].push(connId);
        networkElements[endElement]["left"].push(connId);
    }else if (direction === "backward"){
        networkElements[startElement]["left"].push(connId);
        networkElements[endElement]["right"].push(connId);
    }
}

function moveGroupWithConns(groupName, newPosition){
    var startElement = groupName;
    var endElement = null;
    var startPoint = null;
    var endPoint = null;
    
    // Move right connections.
    var rightConns = networkElements[groupName]["right"];
    for (var i = 0; i < rightConns.length; i++){
        var connObject = connectionObjects[rightConns[i]]["object"]
        if (connectionObjects[rightConns[i]]["direction"] == "forward"){
            startElement = groupName;
            startPoint = networkElements[startElement]["object"].children["right-" + startElement].position;
            endElement = connectionObjects[rightConns[i]]["end"];
            endPoint = networkElements[endElement]["object"].children["left-" + endElement].position;
        }else{
            startElement = connectionObjects[rightConns[i]]["start"];
            startPoint = networkElements[startElement]["object"].children["left-" + startElement].position;
            endElement = groupName;
            endPoint = networkElements[endElement]["object"].children["right-" + endElement].position;        
        }

        renderConnection(startPoint, endPoint, true, connObject ,null, null);
    }

     // Move left connections.
    var leftConns = networkElements[groupName]["left"];
    for (var i = 0; i < leftConns.length; i++){
        var connObject = connectionObjects[leftConns[i]]["object"]
        if (connectionObjects[leftConns[i]]["direction"] == "forward"){
            startElement = connectionObjects[leftConns[i]]["start"];
            startPoint = networkElements[startElement]["object"].children["right-" + startElement].position;
            endElement = groupName;
            endPoint = networkElements[endElement]["object"].children["left-" + endElement].position;
        }else{
            startElement = groupName;
            startPoint = networkElements[startElement]["object"].children["left-" + startElement].position;
            endElement = connectionObjects[leftConns[i]]["end"];
            endPoint = networkElements[endElement]["object"].children["right-" + endElement].position;        
        }

        renderConnection(startPoint, endPoint, true, connObject ,null, null);
    }
}

function drawElement(elementType, elementId, color, imageUrl) {
    if (elementType === "circle"){
        pathElements = drawCircleElement(paper, color, elementId);
        pathElements[1].onMouseDown = function(event){
                                        if (!doConnect){
                                            doConnect = true;
                                            startPoint = this.position;
                                            endPoint = event.point;
                                            currConnectionObject = renderConnection(startPoint, endPoint, false, null, backwardConnectorColor, backwardConnectorThickness);
                                            connStartElement = getGroupOfElement(networkElements, this.name);
                                        }
                                    };
        pathElements[2].onMouseDown = function(event){
                                        if (!doConnect){
                                            doConnect = true;
                                            startPoint = this.position;
                                            endPoint = event.point;
                                            currConnectionObject = renderConnection(startPoint, endPoint, false, null, forwardConnectorColor, forwardConnectorThickness);
                                            connStartElement = getGroupOfElement(networkElements, this.name);
                                        }
                                    };
        pathElements[1].onMouseUp = function(event){
                                        if (doConnect){
                                            doConnect = false;
                                            var connId = Object.keys(connectionObjects).length + 1;
                                            connEndElement = getGroupOfElement(networkElements, this.name);
                                            createConnection(connId, currConnectionObject, connStartElement, connEndElement, "forward");
                                        }
                                    };
        pathElements[2].onMouseUp = function(event){
                                        if (doConnect){
                                            doConnect = false;
                                            var connId = Object.keys(connectionObjects).length + 1;
                                            connEndElement = getGroupOfElement(networkElements, this.name);
                                            createConnection(connId, currConnectionObject, connStartElement, connEndElement, "backward");
                                        }
                                    };

        var group = new Group([pathElements[0], pathElements[1], pathElements[2]]);
        group.name = elementId;
        group.onMouseDrag = function(event) {
            if (!doConnect){                
                group.position += event.delta;
                moveGroupWithConns(this.name, group.position);
            }else{
                renderConnection(startPoint, event.point, true, currConnectionObject, null, null);
            }
        };


        networkElements[elementId] = {};
        networkElements[elementId]["object"] = group;
        networkElements[elementId]["right"] = [];
        networkElements[elementId]["left"] = [];
    }
}


/*
* Flow starts here
*/
$(document).ready(function(){
    drawGridLines();
    drawElement("circle", "e001", 'brown', null);
    drawElement("circle", "e002", 'green', null);
    drawElement("circle", "e003", 'purple', null);
});