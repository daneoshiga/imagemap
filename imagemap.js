var viewer = null;

function init() {
    var container = document.getElementById("container");
    var PRECISION = 2;   // number of decimal places
    var markers = [];
    var tagCounter = 0;
    //avoid zooming on click
    SeadragonConfig.zoomPerClick = 1;

    var tracker = new Seadragon.MouseTracker(container);
    viewer = new Seadragon.Viewer("container");
    viewer.clearControls();


    ///////// popup
    $("#container").wrap('<div id="tag-wrapper"></div>');
    //Append #tag-target content and #tag-input content
    $("#tag-wrapper").append(
            '<div id="tag-input">'+
            '<form id="tag-form">'+
            '<input type="hidden" name="tag-x" id="tag-x">'+
            '<input type="hidden" name="tag-y" id="tag-y">'+
            'Marque essa região'+
            '<label for="tag-name">Nome</label>'+
            '<input type="text" id="tag-name">'+
            '<label for="tag-desc">Descri&ccedil;&atilde;o</label>'+
            '<input type="text" id="tag-desc">'+
            '<label for="tag-birth">Nascimento</label>'+
            '<input type="text" id="tag-birth">'+
            '<label for="tag-pic">Foto</label>'+
            '<input type="text" id="tag-pic">'+
                '<button type="submit">Marcar</button><button type="reset">Sair</button></div>'+
                '</form>'
                );

    $('#tag-form').submit(function() {

        var x = $("#tag-x").val();
        var y = $("#tag-y").val();

        createMark(x,y,$("#tag-name").val(),$("#tag-desc").val(),$("#tag-birth").val(),$("#tag-pic").val());
        return false;
    });

    function createMark(x, y, name, desc, birth, pic) {
        var div = document.createElement("div");

        var rect = new Seadragon.Rect(  
            //TODO make these values configurable
            x-0.025, y-0.025,
            0.05, 0.05);

        div.className = "overlay";
        // adds mouse events to the marker
        div.onmousehover = function () { markerOnHover(rect)};
        div.onmouseclick = function () { markerOnClick(rect)};

        viewer.viewport.fitBounds(rect);
        viewer.viewport.ensureVisible();
        viewer.drawer.addOverlay(div, rect);

        mark = {'x':     x,
                'y':     y,
                'name':  name,
                'desc':  desc,
                'birth': birth,
                'pic':   pic
        }

        //TODO add function to deal with name, desc, birth and pic
        //TODO add function to send the mark to db (ajax)

        markers.push(mark);
    }

    function loadMarks() {

        $.getJSON('oldermarks.json', function(obj){
            $.each(obj,function() {
                createMark(this.x, this.y, this.name, this.desc, this.birth, this.pic);
            });
       
        });

    };

    viewer.addEventListener("open",loadMarks);

    tracker.clickHandler = function(tracker, position, quick, shift) {
        // just if it's a quick click... if not, doesn't marks
        if (quick == true) {
            //takes point where click occured information and them draws a
            //rectangle around that point

            var point = viewer.viewport.pointFromPixel(position);
            $('#tag-x').val(point.x);
            $('#tag-y').val(point.y);
            var div = document.createElement("div");

            if (point.x > 0 && point.x < 1 && point.y > 0) {
                //TODO add here code for inputing comment 
                $("#tag-target").css({left: position.x, top: position.y}).fadeIn();
                $("#tag-input").css({left: position.x, top: position.y}).fadeIn();
                $("#tag-name").focus();	
                //alert(rect);
            }
        }
    }

    viewer.openDzi("./tiles/img5.dzi");

    //start tracking mouse
    tracker.setTracking(true);


    viewer.addEventListener("open", showViewport);
    viewer.addEventListener("animation", showViewport);
    //        Seadragon.Utils.addEvent(viewer.elmt, "mousemove", showMouse);


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

        //         document.getElementById("viewportSizePoints").innerHTML
        //         = toString(sizePoints, false);

        //         document.getElementById("viewportSizePixels").innerHTML
        //         = toString(sizePixels, false);
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

    // Events Functions
    function markerOnHover (rect) {
        viewer.viewport.fitBounds(rect);
        viewer.viewport.ensureVisible();
        
    }

    function markerOnClick (rect) {

    }
    
    //If cancel button is clicked
    $('button[type="reset"]').click(function(){
	closeTagInput();
    });
    
    //If enter button is clicked within #tag-input
    $("#tag-name").keyup(function(e) {
	if(e.keyCode == 13) submitTag();
    });	
    
    //If submit button is clicked
    $('button[type="submit"]').click(function(){
	submitTag();
    });

    function submitTag() {
        tagValue = $("#tag-name").val();	
        
        tagCounter++;
        closeTagInput();
    }

    function closeTagInput() {
        $("#tag-target").fadeOut();
        $("#tag-input").fadeOut();
    }

    function removeTag(i) {
        $("#hotspot-item-"+i).fadeOut();
        $("#hotspot-"+i).fadeOut();
    }

    function showTag(i) {
        $("#hotspot-"+i).addClass("hotspothover");
    }
    function hideTag(i) {
        $("#hotspot-"+i).removeClass("hotspothover");
    }

    // viewer = new Seadragon.Viewer("container");
    // viewer.openDzi("blue-marble.dzi");
}

function switchTo(event, dzi) {
    if (dzi) {
        viewer.openDzi(dzi);
    } else {
        viewer.close();
    }
    
    // don't let the browser handle the link
    Seadragon.Utils.cancelEvent(event);   
}

Seadragon.Utils.addEvent(window, "load", init);
