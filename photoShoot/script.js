$(document).ready(function(){
	/* This code is executed after the DOM has been completely loaded */

	// Assigning the jQuery object to a variable for speed:
	var main = $('#main');	

	// Setting the width of the photoshoot area to 
	// 1024 px or the width of the document - whichever is smallest:
	
	main.width(Math.min(1024,$(document).width()));
	
	// Creating an array with four possible backgrounds and their sizes:
	
	var pics = new Array(						 
							{ url:'../crowdbig2.jpg', size:{x:4370,y:2913}}
	);
	
	var bg = pics[0];
	
	// Creating an options object (try tweeking the variables):
	
	var opts = {
        viewFinder	:	{ width:150, height:100, img:'' },
		image		:	bg.url,
		onClick		:	shoot,
		opacity		:	0.8,
		blurLevel	:	4
	}
	
	// Converting the #main div to a photoShoot stage:
	
	main.photoShoot(opts);

	// Adding the album holder to the stage:
	$('<div class="album">').html('<div class="slide" />').appendTo('#photoalbum');


	// Our own shoot function (it is passed as onClick to the options array above):
	
	function shoot(position){
		// This function is called by the plug-in when the button is pressed
		// FIXME show the "shoots" on the same place it was made (minimal)
		// FIXME when shoot, show input, so the "tagger" can add a note, this
		// FIXME add message on alt from image
		// note will be sent with json, with place info
		
		// Setting the overlay's div to white will create the illusion of a camera flash:
		main.find('.overlay').css('background-color','white');
		
		// The flash will last for 100 milliseconds (a tenth of the second):
		setTimeout(function(){main.find('.overlay').css('background-color','')},100);
	    
	    newShot = addshoot(position);


		// Removing the fourth shot (the count starts from 0):
		$('.shot').eq(3).remove();
		
		// Adding the newly created shot to the album div, but moved 160px to the right.
		// We start an animation to slide it in view:
		
		newShot.css('margin-right',-160).prependTo('.album .slide').animate({marginRight:0},'slow');
	}

	function addshoot(position) {
	    //position.height, position.width = viewFinder opts
	    //position.left, position.top = margintop and marginleft that is needed

	    //This function adds new shot images to page, the idea is being able to
	    //use it not only from onClick action on photoShoot, but also grabbing
	    //data from elsewhere
		// Creating a new shot image:
		var newShot = $('<div class="shot">').width(150).height(100);
        
        var shot = $(
                '<img src="'+bg.url+'"'+
                ' width="'+(bg.size.x/2)+'"'+
                ' height="'+(bg.size.y/2)+'"'+
                ' />'
                ).css({
                    'margin-top' : -position.top*0.5+'px',
                    'margin-left': -position.left*0.5+'px'
                })


        var tagger = 
            '<div id="tag-input">'+
                '<label for="tag-name">Marque essa região</label>'+
                '<input type="text" id="tag-name">'+
                '<button type="submit">Marcar</button>'+
                '<button type="reset">Sair</button>'+
            '</div>';

		newShot.append(tagger);
		newShot.append(shot);
		var margintop = position.top;
		var marginleft = position.left;
        
        var foto = [{
            "imagem" : bg.url,
            "bgx"    : bg.size.x,
            "bgy"    : bg.size.y,
            "height" : position.height,
            "width"  : position.width,
            "top"    : position.top,
            "left"   : marginleft
        }];

        //FIXME turn this on a ajax post
        console.log(foto);

        return newShot;
    }
        
});
