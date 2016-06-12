var doConnect = false;

function drawCircleElement(paperObject){
     var path = new paperObject.Path.Circle({
                center: paperObject.view.center,
                radius: 30,
                fillColor: 'red'
            });

            path.bringToFront();

            var centerPoint = new paperObject.Point(path.position.x + (path.bounds.width/2), path.position.y);
    
            var path2 = new paperObject.Path.Circle({
                center: centerPoint,
                radius: 5,
                fillColor: 'blue',
                onMouseDown: function(event){
                    doConnect = true;
                },
                onMouseUp: function(event){
                    doConnect = false;
                }
            });

            path2.bringToFront();
            return [path, path2];
           
}