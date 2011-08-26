// Imagemap.js - Lab Macambira 2011 - Transparência Hacker
//
// Based on these works:
// - http://hitconsultants.com/dragscroll_scrollsync/scrollpane.html
// - http://code.google.com/p/jquery-scrollview (MIT License) - Toshimitsu Takahashi
// - http://www.nealgrosskopf.com/tech/thread.php?pid=62
// - http://www.nealgrosskopf.com/tech/resources/62/
// "possibly in the future"
// http://www.spiceupyourblog.com/2010/05/blurred-image-effect-blogger.html
// this demo is amazing o.O
// http://tutorialzine.com/2010/02/photo-shoot-css-jquery/

var targetX, targetY;
var tagCounter = 0;

$(document).ready(function(){
    $("#map").scrollview({
        grab:"images/openhand.cur",
        grabbing:"images/closedhand.cur"
    });

    var $pancontainer=$('div.pancontainer')
    $pancontainer.each(function(){
	var $this=$(this).css({position:'relative', overflow:'hidden', cursor:'move'})
	var $img=$this.find('img:eq(0)') //image to pan
	var options={$pancontainer:$this, pos:$this.attr('data-orient'), curzoom:1, canzoom:$this.attr('data-canzoom'), wrappersize:[$this.width(), $this.height()]}
	$img.imgmover(options)
    });
        
    //Dynamically wrap image
    $("img").wrap('<div id="tag-wrapper"></div>');
	
    //Dynamically size wrapper div based on image dimensions
    $("#tag-wrapper").css({width: $("img").outerWidth(), height: $("img").outerHeight()});
	
    //Append #tag-target content and #tag-input content
    $("#tag-wrapper").append('<div id="tag-target"></div><div id="tag-input"><label for="tag-name">Marque essa região</label><input type="text" id="tag-name"><button type="submit">Marcar</button><button type="reset">Sair</button></div>');
	
    //$("#tag-wrapper").click(function(e){
    $("img").click(function(e){		
	//Determine area within element that mouse was clicked
	mouseX = e.pageX - $("#tag-wrapper").offset().left;
	mouseY = e.pageY - $("#tag-wrapper").offset().top;
		
	//Get height and width of #tag-target
	targetWidth = $("#tag-target").outerWidth();
	targetHeight = $("#tag-target").outerHeight();
	
	//Determine position for #tag-target
	targetX = mouseX-targetWidth/2;
	targetY = mouseY-targetHeight/2;
	
	//Determine position for #tag-input
	inputX = mouseX+targetWidth/2;
	inputY = mouseY-targetHeight/2;
	
	//Animate if second click, else position and fade in for first click
	if($("#tag-target").css("display")=="block")
	{
	    $("#tag-target").animate({left: targetX, top: targetY}, 500);
	    $("#tag-input").animate({left: inputX, top: inputY}, 500);
	} else {
	    $("#tag-target").css({left: targetX, top: targetY}).fadeIn();
	    $("#tag-input").css({left: inputX, top: inputY}).fadeIn();
	}
		
	//Give input focus
	$("#tag-name").focus();	
    });
	
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

}); 

function submitTag() {
    tagValue = $("#tag-name").val();	
    
    //Adds a new list item below image. Also adds events inline since they are dynamically created after page load
    $("#tag-wrapper").after('<p id="hotspot-item-' + tagCounter + '">' + tagValue + ' <span class="remove" onclick="removeTag(' + tagCounter + ')" onmouseover="showTag(' + tagCounter + ')" onmouseout="hideTag(' + tagCounter + ')">(Remove)</span></p>');
	
    //Adds a new hotspot to image
    $("#tag-wrapper").append('<div id="hotspot-' + tagCounter + '" class="hotspot" style="left:' + targetX + 'px; top:' + targetY + 'px;"><span>' + tagValue + '</span></div>');
    
    tagCounter++;
    closeTagInput();
}

function closeTagInput() {
    $("#tag-target").fadeOut();
    $("#tag-input").fadeOut();
    $("#tag-name").val("");
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
