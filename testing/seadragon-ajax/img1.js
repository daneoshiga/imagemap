var container = document.getElementById("container");
var PRECISION = 2;   // number of decimal places

//avoid zooming on click
SeadragonConfig.zoomPerClick = 1;

var tracker = new Seadragon.MouseTracker(container);
var viewer = new Seadragon.Viewer("container");
var dialog = $("#dialog");
dialog.dialog({
    autoOpen    : false
});

dialog.append(
        'Marque essa regi&atilde;o'+
        '<input type="text"></input>'
        );

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

    //TODO add to class overlay an hover action to display message
    div.className = "overlay";
    viewer.drawer.addOverlay(div, rect);

    dialog.dialog("option",
            "position",
            [position.x,position.y]);

    dialog.dialog( "option", "buttons", { 
        //TODO change this console.log to a send data function
        "Marcar": function() { console.log(point); } ,
        "Sair": function() { $(this).dialog("close"); }
    } );
    dialog.dialog("open");

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

var settings = $.extend({
    viewFinder	:	{ width:100, height:100, img:'../../photoShoot/photoShoot/viewfinder.png' },
});

settings.stage = { width:$("#container").width(), height:$("#container").height() };

if(navigator.userAgent.indexOf('Chrome')!=-1)
{
    $("#container").addClass('googleChrome');
}
else if(navigator.userAgent.indexOf('MSIE')!=-1)
{
    $("#container").css('cursor','url(../../photoShoot/photoShoot/blank.cur), default');
}

var vf = $('<div class="viewFinder">').css({
    width		:	settings.viewFinder.width+'px',
    height		:	settings.viewFinder.height+'px'
}).html('<img src="'+settings.viewFinder.img+'" width="'+settings.viewFinder.width+'" height="'+settings.viewFinder.height+'" />').appendTo($("#container"));

var offSet = $('#container').offset();

var n_left, n_top;

$("#container").mousemove(function(e){

    n_left = (e.pageX-offSet.left)-settings.viewFinder.width/2;
    n_top = (e.pageY-offSet.top)-settings.viewFinder.height/2;

    if(n_left<0 || n_top<0) return false;
    if(n_left+settings.viewFinder.width >=settings.stage.width || n_top+settings.viewFinder.height >= settings.stage.height) return false;

    vf.css({
        left				: n_left,
        top					: n_top,
    });

}).click(function(){

    settings.onClick({
        left	:	parseInt(vf.css('left')),
        top		:	parseInt(vf.css('top')),
        width	:	settings.viewFinder.width,
        height	:	settings.viewFinder.height
    });
});
