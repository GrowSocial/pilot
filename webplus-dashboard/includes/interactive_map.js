// modeled on code by Chris Converse
// for Lynda.com

$(document).ready(function() {

	$('#mapForm').change(function() {	// When the form changes
	
		var selectedContinent = $('#mapForm option:selected').val();
		if (selectedContinent == 'ALL'){
			$('a.dot').slideDown(1000);
		}else{
			$('a.dot[continent = "'+selectedContinent+'"]').slideDown(1000);
			$('a.dot[continent != "'+selectedContinent+'"]').slideUp(1000);
		}
		
	//	Clear city detail area and replace with prompt msg
	// in :: $('.detail_container .city_detail').html( :: jQuery  does not allow breaking the argument literal into multiple lines
	//                                                     also: Requires doublequote wrapper, ticks inside the liter where quotes are needed
	//													::
		$('.detail_container').fadeOut(500, function(){
			$('.detail_container .city_detail').html(
				"<img width='75' class='city_photo' alt='~' src='localResources/images/nothing.png'><div class='city_info'><h3>Click</h3></div>");
			$('.detail_container').fadeIn(500);
		});

	});
	
	//...................................................
	// When a dot is clicked
	$('a.dot').click(function(){

//~ $(this) ==the instance of a class seelcted
//~ $(a,dot) ==applied to the entire class
//~ alert($(this).attr('city') + '~' + $(this).attr('Continent')) //dot attributes

		$('a.dot').removeClass('selected');
		$(this).addClass('selected');

		var city = '.city_detail#' + $(this).attr('city');
		var htmlCode = $(city).html();

		$('.detail_container').fadeOut(500, function(){
			$('.detail_container .city_detail').html(htmlCode);
			$('.detail_container').fadeIn(500);

		});


	});

// end Ready
});