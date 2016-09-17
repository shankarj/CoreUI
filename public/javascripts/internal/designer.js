// View related variables
var viewWidth = view.bounds.width;
var viewHeight = view.bounds.height;
var viewStartX = view.bounds.x;
var viewStartY = view.bounds.y;
var viewCenter = view.bounds.center;
var startingViewCenter = view.bounds.center;
var mousePoint = 0;
var selectedElementObj = null;
var selectedConnectionObj = null;
var selectedPropertyObj = null;
var selectedConnRevertThickness = 0;
var selectedConnRevertColor = null;
var doConnect = false;
var connectionsCount = 0;
var nElements = [];
var deployJson = null;

// Canvas Object event inits.
var canvasObject = document.getElementById("networkCanvas");
// canvasObject.addEventListener("mousewheel", zoomCanvasHandler, false); // For IE, Chrome
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

function onMouseDown(event) {
    if (connClicked) {
        connClicked = false;
        selectedConnectionObj.strokeColor = selectedConnRevertColor;
        selectedConnectionObj.strokeWidth = selectedConnRevertThickness;
    }


}

function onMouseMove(event) {
    mousePoint = event.point;
}

function onMouseUp(event) {
    if (doConnect) {
        currConnectionObject.remove();
        currConnectionObject = null;
        doConnect = false;
    }
}

function onKeyDown(event) {

    if (connClicked) {
        if (event.key === 'delete') {
            var connId = selectedConnectionObj.name;
            var startElement = connectionObjects[connId]["start"];
            var endElement = connectionObjects[connId]["end"];
            if (connectionObjects[connId]["direction"] == "forward") {
                var index = networkElements[startElement]["right"].indexOf(connId);
                networkElements[startElement]["right"].splice(index, 1);
                index = networkElements[endElement]["left"].indexOf(connId);
                networkElements[endElement]["left"].splice(index, 1);
            } else {
                var index = networkElements[startElement]["left"].indexOf(connId);
                networkElements[startElement]["left"].splice(index, 1);
                index = networkElements[endElement]["right"].indexOf(connId);
                networkElements[endElement]["right"].splice(index, 1);
            }

            selectedConnectionObj = null;
            connectionObjects[connId]["object"].remove();
            delete connectionObjects[connId];

            connClicked = false;
            view.update();
        }
    }
    else if (elementClicked) {
        if (event.key === 'delete') {

            elementId = selectedElementObj.name;
            selectedElementObj = null;
            console.log("Deleting")
            networkElements[elementId]["object"].remove();
            delete networkElements[elementId]["object"];
            view.update();
        }
    }
    else if (propClicked) {
        if (event.key === 'delete') {

            elementId = selectedPropertyObj.name;
            selectedPropertyObj = null;
            console.log("Deleting")
            networkElements[elementId]["object"].remove();
            delete networkElements[elementId]["object"];
            view.update();

        }

    }
}
function zoomCanvasHandler(e) {
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    var oldZoom = view.zoom;
    var newZoom = view.zoom + (delta / zoomFactor);

    if (newZoom < 1) {
        view.zoom = 1;
        view.center = startingViewCenter;
    } else if (newZoom > 10) {
        view.zoom = 10;
    } else {
        if ((view.zoom >= 1) && (view.zoom <= 10)) {
            view.zoom = newZoom;
        }
        var zoomRatio = oldZoom / newZoom;
        var scaleDiff = mousePoint - view.center;
        var offset = mousePoint - (scaleDiff * zoomRatio) - view.center;
        view.center += offset;
    }
}

/*
 * Drawing grid lines.
 */
function drawGridLines() {
    for (var i = 0; i <= viewHeight; i = i + 35) {
        var horLine = new Path();
        horLine.strokeColor = 'gray';
        horLine.opacity = 1;
        horLine.add(new Point(0, i), new Point(viewWidth, i));
        horLine.dashArray = [0.2, 10];
    }

    for (var i = 0; i <= viewWidth; i = i + 35) {
        var verLine = new Path();
        verLine.strokeColor = 'gray';
        verLine.opacity = 1;
        verLine.add(new Point(i, 0), new Point(i, viewHeight));
        verLine.dashArray = [0.2, 10];
    }


}


/*
 * --------------------------------------
 * main function to draw a given element type. Renders element on canvas and
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
var connClicked = false;
var elementClicked = false;
var propClicked = false;
var setCurrentConnId = null;
function renderConnection(startPoint, endPoint, isUpdate, connObject, color, thickness) {
    var helperRect = new Rectangle(startPoint, endPoint);

    if (startPoint.y < endPoint.y) {
        handleOut = helperRect.topCenter - startPoint;
        handleIn = helperRect.bottomCenter - endPoint;
    } else {
        handleOut = helperRect.bottomCenter - startPoint;
        handleIn = helperRect.topCenter - endPoint;
    }

    if (!isUpdate) {
        var connSeg1 = new Segment(startPoint, null, handleOut);
        var connSeg2 = new Segment(endPoint, handleIn, null);
        var connectionObject = new Path(connSeg1, connSeg2);
        connectionObject.strokeColor = color;
        connectionObject.strokeWidth = thickness;
        connectionObject.strokeCap = 'round';
        connectionObject.sendToBack();
        connectionObject.onMouseEnter = function (event) {
            if (!connClicked) {
                selectedConnRevertThickness = this.strokeWidth;
                this.strokeWidth *= 2;
            }
        };
        connectionObject.onMouseLeave = function (event) {
            var newThickness = thickness;
            if (!connClicked) {
                this.strokeWidth = newThickness;
            }
        };
        connectionObject.onClick = function (event) {
            if (!connClicked) {
                selectedConnRevertColor = this.strokeColor;
                this.strokeColor = 'red';
                connClicked = true;
                selectedConnectionObj = this;
            }
        };

        return connectionObject;
    } else {
        connObject.segments[1].point = endPoint;
        connObject.segments[0].point = startPoint;
        connObject.segments[0].handleOut = handleOut;
        connObject.segments[1].handleIn = handleIn;
    }
    delete helperRect;
}
function createConnection(connId, connObject, startElement, endElement, connDirection) {
    connectionObjects[connId] = {};
    connObject.name = connId;
    connectionObjects[connId]["object"] = connObject;
    connectionObjects[connId]["start"] = startElement;
    connectionObjects[connId]["end"] = endElement;
    connectionObjects[connId]["direction"] = connDirection;
    addConnectionToGroup(connId, startElement, endElement, connDirection);
}
function addConnectionToGroup(connId, startElement, endElement, direction) {
    if (direction === "forward") {
        networkElements[startElement]["right"].push(connId);
        networkElements[endElement]["left"].push(connId);
    }
    if (direction == "bottom") {
        networkElements[startElement]["bottom"].push(connId);
        networkElements[endElement]["top"].push(connId);

    }
    if (direction == "top") {
        networkElements[startElement]["top"].push(connId);
        networkElements[endElement]["bottom"].push(connId);

    }

}
function moveGroupWithConns(groupName, newPosition) {
    var startElement = groupName;
    var endElement = null;
    var startPoint = null;
    var endPoint = null;

    // Move right connections.
    var rightConns = networkElements[groupName]["right"];
    for (var i = 0; i < rightConns.length; i++) {
        var connObject = connectionObjects[rightConns[i]]["object"]
        if (connectionObjects[rightConns[i]]["direction"] == "forward") {
            startElement = groupName;
            startPoint = networkElements[startElement]["object"].children["right-" + startElement].position;
            endElement = connectionObjects[rightConns[i]]["end"];
            endPoint = networkElements[endElement]["object"].children["left-" + endElement].position;
        } else {
            startElement = connectionObjects[rightConns[i]]["start"];
            startPoint = networkElements[startElement]["object"].children["left-" + startElement].position;
            endElement = groupName;
            endPoint = networkElements[endElement]["object"].children["right-" + endElement].position;
        }
        renderConnection(startPoint, endPoint, true, connObject, null, null);
    }

    // Move left connections.
    var leftConns = networkElements[groupName]["left"];
    for (var i = 0; i < leftConns.length; i++) {
        var connObject = connectionObjects[leftConns[i]]["object"]
        if (connectionObjects[leftConns[i]]["direction"] == "forward") {
            startElement = connectionObjects[leftConns[i]]["start"];
            startPoint = networkElements[startElement]["object"].children["right-" + startElement].position;
            endElement = groupName;
            endPoint = networkElements[endElement]["object"].children["left-" + endElement].position;
        } else {
            startElement = groupName;
            startPoint = networkElements[startElement]["object"].children["left-" + startElement].position;
            endElement = connectionObjects[leftConns[i]]["end"];
            endPoint = networkElements[endElement]["object"].children["right-" + endElement].position;
        }

        renderConnection(startPoint, endPoint, true, connObject, null, null);
    }

    // Move top prop connections.
    var topConns = networkElements[groupName]["top"];
    for (var i = 0; i < topConns.length; i++) {
        var connObject = connectionObjects[topConns[i]]["object"]
        if (connectionObjects[topConns[i]]["direction"] == "bottom") {
            startElement = connectionObjects[topConns[i]]["start"];
            startPoint = networkElements[startElement]["object"].children["bottom-" + startElement].position;
            endElement = groupName;
            endPoint = networkElements[endElement]["object"].children["top-" + endElement].position;
        }

        renderConnection(startPoint, endPoint, true, connObject, null, null);
    }
}
function movePropGroupConns(groupName, newPosition) {

    // Move bottom prop connections.

    var bottomConns = networkElements[groupName]["bottom"];

    for (var i = 0; i < bottomConns.length; i++) {
        var connObject = connectionObjects[bottomConns[i]]["object"]
        if (connectionObjects[bottomConns[i]]["direction"] == "bottom") {
            startElement = groupName;
            startPoint = networkElements[startElement]["object"].children["bottom-" + startElement].position;
            endElement = connectionObjects[bottomConns[i]]["end"];

            endPoint = networkElements[endElement]["object"].children["top-" + endElement].position;
        }

        renderConnection(startPoint, endPoint, true, connObject, null, null);
    }
}
function drawProperty(elementType, elementId, color, imageUrl) {
    var propPathElements = null;
    propPathElements = drawPropertyElement(paper, color, elementId);
    //returns element,bottom
    // pathElements[1].onMouseDown = function (event) {
    //
    //     if (!doConnect) {
    //         doConnect = true;
    //         startPoint = this.position;
    //         endPoint = event.point;
    //         currConnectionObject = renderConnection(startPoint, endPoint, false, null, backwardConnectorColor, backwardConnectorThickness);
    //         connStartElement = getGroupOfElement(networkElements, this.name);
    //     }
    // };


    propPathElements[1].onMouseDown = function (event) {
        console.log("onPathElement 1 mouse down " + doConnect);
        if (!doConnect) {
            doConnect = true;
            console.log(doConnect)
            startPoint = this.position;
            endPoint = event.point;
            currConnectionObject = renderConnection(startPoint, endPoint, false, null, forwardConnectorColor, forwardConnectorThickness);
            connStartElement = getGroupOfElement(networkElements, this.name);
        }
    };

    propPathElements[1].onMouseEnter = function (event) {
        this.strokeWidth += 4;
    };
    propPathElements[1].onMouseLeave = function (event) {
        this.strokeWidth -= 4;
    };
    var group = new Group([propPathElements[0], propPathElements[1]]);
    group.name = elementId;
    group.onDoubleClick = function (event) {

        $('#elementInfo').modal('show');
        var recipient = this.name;  // Extract info from data-* attributes
        $('#elementInfo').on('shown.bs.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal

            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this)
            modal.find('.modal-title').text('Element Information - ' + recipient)

        })


    };


    function placeDiv(x_pos, y_pos, content) {
        var d = document.getElementById('sample');
        d.style.position = "absolute";
        d.style.left = x_pos + 'px';
        d.style.top = y_pos + 'px';
        d.innerHTML = content;
    }

    group.onClick = function (event) {
        propClicked = true;
        selectedPropertyObj = this;
        var content = group.name;
        placeDiv(event.point.x, event.point.y + 20, content)
    }
    group.onMouseDrag = function (event) {
        if (!doConnect) {
            group.position += event.delta;
            movePropGroupConns(this.name, group.position);
        } else {
            renderConnection(startPoint, event.point, true, currConnectionObject, null, null);
        }
    };
    group.onMouseEnter = function (event) {
        if (doConnect) {
            this.dashArray = [4, 4];
        }
    };
    group.onMouseLeave = function (event) {
        this.dashArray = [0, 0];
    };
    networkElements[elementId] = {};
    networkElements[elementId]["object"] = group;
    networkElements[elementId]["bottom"] = [];


}
function drawElement(elementType, elementId, color, imageUrl) {
    var pathElements = null;
    if (elementType === "circle") {
        pathElements = drawCircleElement(paper, color, elementId);
    }
    else if (elementType === "rect") {
        pathElements = drawRoundedRectElement(paper, color, elementId);
    }


    function saveConnection(current) {
        if (doConnect) {
            doConnect = false;
            connectionsCount += 1;
            var connId = "c" + connectionsCount;
            setCurrentConnId = connId;
            connEndElement = getGroupOfElement(networkElements, current.name);
            createConnection(connId, currConnectionObject, connStartElement, connEndElement, "forward");
            console.log(connId)

        }
    }

    $('#cancel-conn').click(function (event) {
        console.log(setCurrentConnId)
        doConnect = false;
        connectionObjects[setCurrentConnId]["object"].remove();

    });

    pathElements[1].onMouseUp = function (event) {
        $('#newConnection').modal('show');

        saveConnection(this);


    };
    pathElements[1].onMouseEnter = function (event) {
        this.strokeWidth += 4;
    };
    pathElements[1].onMouseLeave = function (event) {
        this.strokeWidth -= 4;
    };
    pathElements[2].onMouseDown = function (event) {

        if (!doConnect) {
            doConnect = true;
            startPoint = this.position;
            endPoint = event.point;
            currConnectionObject = renderConnection(startPoint, endPoint, false, null, forwardConnectorColor, forwardConnectorThickness);
            connStartElement = getGroupOfElement(networkElements, this.name);
        }
    };
    pathElements[2].onMouseEnter = function (event) {
        this.strokeWidth += 4;
    };
    pathElements[2].onMouseLeave = function (event) {
        this.strokeWidth -= 4;
    };

    // Property bottom to top
    pathElements[3].onMouseUp = function (event) {

        console.log("onPathElement 3 mouse Up " + doConnect);
        if (doConnect) {
            doConnect = false;
            connectionsCount += 1;
            var connId = "c" + connectionsCount;
            console.log(connId)
            connEndElement = getGroupOfElement(networkElements, this.name);
            createConnection(connId, currConnectionObject, connStartElement, connEndElement, "bottom");
        }
    };
    // Property both sides
    pathElements[3].onMouseDown = function (event) {

        if (!doConnect) {
            doConnect = true;
            startPoint = this.position;
            endPoint = event.point;
            currConnectionObject = renderConnection(startPoint, endPoint, false, null, backwardConnectorColor, backwardConnectorThickness);
            connStartElement = getGroupOfElement(networkElements, this.name);
        }
    };


    var group = new Group([pathElements[0], pathElements[1], pathElements[2], pathElements[3]]);
    group.name = elementId;

    group.onDoubleClick = function (event) {

        $('#elementInfo').modal('show');
        $('#elementInfo').on('shown.bs.modal', function (event) {

            var button = $(event.relatedTarget) // Button that triggered the modal
            var recipient = group.name;  // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this)
            modal.find('.modal-title').text('Element Information - ' + recipient)

        })


    };


    function placeDiv(x_pos, y_pos, content) {
        var d = document.getElementById('sample');
        d.style.position = "absolute";
        d.style.left = x_pos + 'px';
        d.style.top = y_pos + 'px';
        d.innerHTML = content;
    }


    group.onClick = function (event) {
        elementClicked = true;
        selectedElementObj = this;
        var content = group.name;
        placeDiv(event.point.x, event.point.y + 20, content)
    }
    group.onMouseDrag = function (event) {

        if (!doConnect) {
            group.position += event.delta;
            moveGroupWithConns(this.name, group.position);

        } else {
            renderConnection(startPoint, event.point, true, currConnectionObject, null, null);
        }
    };
    group.onMouseEnter = function (event) {

        if (doConnect) {
            this.dashArray = [4, 4];
        }
    };
    group.onMouseLeave = function (event) {
        this.dashArray = [0, 0];
    };


    networkElements[elementId] = {};
    networkElements[elementId]["object"] = group;
    networkElements[elementId]["right"] = [];
    networkElements[elementId]["left"] = [];
    networkElements[elementId]["top"] = []
}
/*
 * Flow starts here
 */
$(document).ready(function () {
    drawGridLines();

    $('.add-element-submit').click(function () {


        drawElement("rect", "newElement" + (nElements.length + 1), '#E0E0E0', null);
        var tem = {
            'id': nElements.length + 1,
            'type': 'normal',
            'nLeft': 0,
            'nRight': 0,
            'nTop': 0

        }

        nElements.push(tem)

        deployJson = JSON.stringify(nElements);

    })

    $('#deploy').click(function () {

        console.log(deployJson)


    })

    drawElement("rect", "element002", '#F0F0F0', null);
    drawElement("rect", "element003", '#E0E0E0', null);
    drawProperty("somethingelse", "propertyElementSelected", "#424242", null);
    // drawProperty("somethingelse", "another", "#424242", null);


});
