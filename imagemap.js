function () {

        var container = document.getElementById("container");
        var PRECISION = 2;   // number of decimal places

        //avoid zooming on click
        SeadragonConfig.zoomPerClick = 1;

        var tracker = new Seadragon.MouseTracker(container);
        var viewer = new Seadragon.Viewer("container");

        tracker.pressHandler = function(tracker, position) {
            //takes point where click occured information and them draws a
            //rectangle around that point

            var point = viewer.viewport.pointFromPixel(position);
            var div = document.createElement("div");
            //makes a rect of 1x1 "points" starting on 0.8x0.9
            var rect = new Seadragon.Rect(  
            //TODO make these values configurable
            point.x-0.025, point.y-0.025,
            0.05, 0.05);

            div.className = "overlay";
            viewer.drawer.addOverlay(div, rect);

            //TODO add here code for inputing comment 
            console.log(point);

        }

        viewer.openDzi("img1.dzi");

        //start tracking mouse
        tracker.setTracking(true);


        function markPoints(viewer) {
            //function to test creating marks from the load moment

            //TODO call a function to look for points data externally
            //iterate throw these points, ploting to image
            var pos = new Array();
            pos.x = 0.85;
            pos.y = 0.05;
            if (!viewer.isOpen()) {
                return;
            }
            var div = document.createElement("div");
            var rect = new Seadragon.Rect(
            pos.x-0.025, pos.y-0.025,
            0.05, 0.05);

            div.className = "overlay";
            viewer.drawer.addOverlay(div, rect);

        }

        viewer.addEventListener("open", showViewport);
        viewer.addEventListener("open", markPoints);
        viewer.addEventListener("animation", showViewport);
        Seadragon.Utils.addEvent(viewer.elmt, "mousemove", showMouse);


        function showMouse(event) {
            // getMousePosition() returns position relative to page,
            // while we want the position relative to the viewer
            // element. so subtract the difference.
            var pixel = Seadragon.Utils.getMousePosition(event).minus
            (Seadragon.Utils.getElementPosition(viewer.elmt));

            document.getElementById("mousePixels").innerHTML
            = toString(pixel, true);

            if (!viewer.isOpen()) {
                return;
            }

            var point = viewer.viewport.pointFromPixel(pixel);

            document.getElementById("mousePoints").innerHTML
            = toString(point, true);
        }

        function showViewport(viewer) {
            if (!viewer.isOpen()) {
                return;
            }

            var sizePoints = viewer.viewport.getBounds().getSize();
            var sizePixels = viewer.viewport.getContainerSize();
            // or = viewer.viewport.deltaPixelsFromPoints(sizePoints);

            document.getElementById("viewportSizePoints").innerHTML
            = toString(sizePoints, false);

            document.getElementById("viewportSizePixels").innerHTML
            = toString(sizePixels, false);
        }

        function toString(point, useParens) {
            var x = point.x;
            var y = point.y;

            if (x % 1 || y % 1) {     // if not an integer,
            x = x.toFixed(PRECISION); // then restrict number of
            y = y.toFixed(PRECISION); // decimal places
        }

        if (useParens) {
            return "(" + x + ", " + y + ")";
            } else {
            return x + " x " + y;
        }
    }
}();