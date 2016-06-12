// View related variables
var viewWidth = view.bounds.width;
var viewHeight = view.bounds.height;
var viewStartX = view.bounds.x;
var viewStartY = view.bounds.y;
var viewCenter = view.bounds.center;
var startingViewCenter = view.bounds.center;
var mousePoint = 0;

// Settings
var zoomFactor = 2;
var gridSize = 10;

// Canvas Object event inits. Events in canvasEvents.js
var canvasObject = document.getElementById("networkCanvas");
canvasObject.addEventListener("mousewheel", zoomCanvasHandler, false); // For IE, Chrome
canvasObject.addEventListener("DOMMouseScroll", zoomCanvasHandler, false); // For Firefox

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

var doConnect = false;

$(document).ready(function(){
    drawGridLines();
    drawElement("circle", null);
});


/*
* Main function to draw a given element type. Renders element on canvas and
* stores it in the global dictionary.
*/
var doConnect = false;
function drawElement(elementType, imageName) {
    if (elementType === "circle"){
        pathElements = drawCircleElement(paper);
        pathElements[1].onMouseDown = function(event){
                                        doConnect = true;
                                    };
        pathElements[1].onMouseUp = function(event){
                                        doConnect = false;
                                    };

        var group = new Group([pathElements[0], pathElements[1]]);
        
        group.onMouseDrag = function(event) {
            if (!doConnect){
                group.position += event.delta;
            }
        }
    }
}
