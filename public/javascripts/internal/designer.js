// Canvas related variables
var viewWidth = view.bounds.width;
var viewHeight = view.bounds.height;
var viewStartX = view.bounds.x;
var viewStartY = view.bounds.y;
var viewCenter = view.bounds.center;
var viewPoint = 0;
var startingViewCenter = view.bounds.center;

// Grid Lines setting
var gridSize = 10;

var path = new Path.Circle({
	center: view.center,
	radius: 30,
	strokeColor: 'red'
});


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

drawGridLines();

var myimage = document.getElementById("networkCanvas");
myimage.addEventListener("mousewheel", MouseWheelHandler, false);

function MouseWheelHandler(e) { 
	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    
    var oldZoom = view.zoom;

    if ((delta == 1) && (view.zoom <= 10)){
        view.zoom += delta / 10;
    }

    if ((delta == -1) && (view.zoom > 1)){
        view.zoom += delta / 10;
    }

    var beta = oldZoom / view.zoom;
    var pc = viewPoint - view.center;
    var a = viewPoint - (pc  * beta) - view.center;
    view.center += a;

    if (view.zoom <= 1){
        view.zoom = 1;
        view.center = startingViewCenter;
    }

    console.log(view.zoom);

}

function onMouseMove(event) {
    viewPoint = event.point;
}