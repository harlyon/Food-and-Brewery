var brewApp = {};

brewApp.apiKey = "3BUKQ0PLD3SPNW4KRDRH05W3PHE3M23EA1YSOBKJEQUQG4C0";

brewApp.init = function() {
	$('#submitForm').on('submit', function(e) {
		e.preventDefault();
		var userCity = $('#searchCity').val();
		console.log('city', userCity);
		var typeOfFood = $('#typeOfFood').val();
		var foodPrice = $('#foodPrice').val(); 
		var breweryPrice = $('#breweryPrice').val();
		brewApp.getResults(userCity, typeOfFood, foodPrice, breweryPrice);
		breweryRating =$('#breweryRating').val();
		foodRating =$('#foodRating').val();
		$('.foodType').text(typeOfFood);
		$('.results').css('display', 'flex').fadeIn(3000);
		$('input', 'select').val('').removeAttr('checked').removeAttr('selected');
	}) //end submit form
};


brewApp.getResults = function(location, typeOfFood, foodPrice, breweryPrice) {
	brewApp.getFood = $.ajax({
		url: "https://api.foursquare.com/v2/venues/explore",
		dataType: 'json',
		data: {
			near: location,
			client_id: brewApp.apiKey,
			client_secret: 'QTAIFHU51DLAHY4U3VLUAA5CVIVGNLPJOJVSOCCYMGOEWP4T',
			v: "20170304",
			query: typeOfFood,
			limit: 50,
			venuePhotos: 1, 
			price: foodPrice
	
		}
	}) //end getFood

	brewApp.getBreweries = $.ajax({
		url: "https://api.foursquare.com/v2/venues/explore",
		dataType: 'json',
		data: {
			near: location,
			client_id: brewApp.apiKey,
			client_secret: 'QTAIFHU51DLAHY4U3VLUAA5CVIVGNLPJOJVSOCCYMGOEWP4T',
			v: "20170304",
			query: "brewery",
			limit: 50,
			venuePhotos: 1, 
			price: breweryPrice
	
		}
	}); //end getBreweries

	$.when(brewApp.getBreweries, brewApp.getFood)
	.done(function(breweries, food) {
		var brewerySpots = breweries[0].response.groups[0].items;
		var foodSpots = food[0].response.groups[0].items;
		brewerySpots = _.shuffle(brewerySpots);
		foodSpots = _.shuffle(foodSpots);
		console.log('brewerys', brewerySpots);
		console.log('food', foodSpots);
		brewApp.displayResults(brewerySpots, foodSpots);
	})
} //end getResults


brewApp.displayResults = function(brewerySpots, foodSpots) {
	var userBrewSelection = [];
	var userFoodSelection = [];
	

	$('#food').empty();
	$('#brewery').empty();
	var count;
	
	brewerySpots.forEach(function(brewerySpot) {
		var name = brewerySpot.venue.name;
		var nameElement = $('<h4>').text(name);
		var rating = brewerySpot.venue.rating;
		var ratingElement = $('<h3>').text(rating);
		if (rating >= 8) {
			var ratingElement = $('<h3>').css('color', 'rgb(0, 179, 77)').text(rating);
		} if (rating > 7 && rating < 8) {
			var ratingElement = $('<h3>').css('color', 'rgb(145, 250, 190)').text(rating);
		} if (rating <= 7) {
			var ratingElement = $('<h3>').css('color', 'rgb(194, 163, 50)').text(rating);
		}
		var formattedAddress = brewerySpot.venue.location.formattedAddress[0];
		var formattedAddressElement = $('<p>').text(formattedAddress);
		var image = "img/beer.png";
		var imageElement = $(`<img src='${image}'>`);
		var website = brewerySpot.venue.url;
		if (website !==  undefined) {
			var websiteElement = $(`<a href="${website}" target="_blank"><img src="img/internet.png" class="websiteIcon">`);
		} else {
			var websiteElement = $(`<img src="img/internetNone.png" class="websiteIcon">`);
		}
		var lat = brewerySpot.venue.location.lat;
		var lng = brewerySpot.venue.location.lng;
		var directions = `http://maps.google.com/maps?q=${formattedAddress}`;
		if (lat !== undefined && lng !== undefined) {
			var directionsElement = $(`<a href="${directions}" target="_blank"><img src="img/placeholder.png" class="websiteIcon">`);
		} else {
			var directionsElement = $(`<img src="img/placeholderGrey.png" class="websiteIcon"`);
		}


		if ($('#breweryRating').val() === 'highRated') {
			if (rating >= 8) {
				console.log('name', name);
				var breweryElementLeft = $('<div>').addClass('listingLeft').append(imageElement);
				var breweryElementMid = $('<div>').addClass('listingMid').append(nameElement, formattedAddressElement);
				var breweryElementRight = $('<div>').addClass('listingRight').append(websiteElement, ratingElement, directionsElement);
				var breweryElement = $('<div>').addClass('listing').append(breweryElementLeft, breweryElementMid, breweryElementRight);
				userBrewSelection.push(breweryElement);
			}
		};
		if ($('#breweryRating').val() === 'medRated') {
			if (rating > 7 && rating < 8) {
				var breweryElementLeft = $('<div>').addClass('listingLeft').append(imageElement);
				var breweryElementMid = $('<div>').addClass('listingMid').append(nameElement, formattedAddressElement);
				var breweryElementRight = $('<div>').addClass('listingRight').append(websiteElement, ratingElement, directionsElement);
				var breweryElement = $('<div>').addClass('listing').append(breweryElementLeft, breweryElementMid, breweryElementRight);
				userBrewSelection.push(breweryElement);
			}
		};
		if ($('#breweryRating').val() === 'lowRated') {
			if (rating <= 7) {
				var breweryElementLeft = $('<div>').addClass('listingLeft').append(imageElement);
				var breweryElementMid = $('<div>').addClass('listingMid').append(nameElement, formattedAddressElement, websiteElement);
				var breweryElementRight = $('<div>').addClass('listingRight').append(websiteElement, ratingElement, directionsElement);
				var breweryElement = $('<div>').addClass('listing').append(breweryElementLeft, breweryElementMid, breweryElementRight);
				userBrewSelection.push(breweryElement);
			}
		};
		

	}); //end brewerySpot forEach
	console.log('breweryCount', userBrewSelection);
	userBrewSelection = _.shuffle(userBrewSelection).slice(0,4)	
	if (userBrewSelection.length > 0) {
		$('#brewery').append(userBrewSelection);
	} else {
		$('#brewery').append($('<p>').text("Sorry, there were no results matching your search"))
	}

	foodSpots.forEach(function(foodSpot) {
		var name = foodSpot.venue.name;
		var nameElement = $('<h4 class="divIMG">').text(name);
		var rating = foodSpot.venue.rating;
		var ratingElement = $('<h3>').text(rating);
		if (rating >= 8) {
			var ratingElement = $('<h3>').css('color', 'rgb(0, 179, 77)').text(rating);
		} if (rating > 7 && rating < 8) {
			var ratingElement = $('<h3>').css('color', 'rgb(145, 250, 190)').text(rating);
		} if (rating <= 7) {
			var ratingElement = $('<h3>').css('color', 'rgb(194, 163, 50)').text(rating);
		}
		var formattedAddress = foodSpot.venue.location.formattedAddress[0];
		var formattedAddressElement = $('<p>').text(formattedAddress);
		var website = foodSpot.venue.url;
		if (website !==  undefined) {
			var websiteElement = $(`<a href="${website}" target="_blank"><img src="img/internet.png" class="websiteIcon">`);
		} else {
			var websiteElement = $(`<img src="img/internetNone.png" class="websiteIcon">`);
		}

		if ($('#typeOfFood').val() === "Burgers") {
			var image = "img/burgerIcon.png";
		} else if ($('#typeOfFood').val() === "Pizza") {
			var image = "img/pizzaIcon.png";
		} else if ($('#typeOfFood').val() === 'Sushi') {
			var image = "img/sushi.png";
		} else {
			var image = "img/pho.png";
		}
		var imageElement = $(`<img src='${image}'>`);

		var lat = foodSpot.venue.location.lat;
		var lng = foodSpot.venue.location.lng;
		var directions = `http://maps.google.com/maps?q=${formattedAddress}`;
		if (lat !== undefined && lng !== undefined) {
			var directionsElement = $(`<a href="${directions}" target="_blank"><img src="img/placeholder.png" class="websiteIcon">`);
		} else {
			var directionsElement = $(`<img src="img/placeholderGrey.png" class="websiteIcon"`);
		}

		if ($('#foodRating').val() === 'highRated') {
			if (rating > 8) {
				var foodElementLeft = $('<div>').addClass('listingLeft').append(imageElement);
				var foodElementMid = $('<div>').addClass('listingMid').append(nameElement, formattedAddressElement);
				var foodElementRight = $('<div>').addClass('listingRight').append(websiteElement, ratingElement, directionsElement);
				var foodElement = $('<div>').addClass('listing').append(foodElementLeft, foodElementMid, foodElementRight);
				userFoodSelection.push(foodElement);
			}
		};
		if ($('#foodRating').val() === 'medRated') {
			if (rating > 6 && rating < 8) {
				var foodElementLeft = $('<div>').addClass('listingLeft').append(imageElement);
				var foodElementMid = $('<div>').addClass('listingMid').append(nameElement, formattedAddressElement);
				var foodElementRight = $('<div>').addClass('listingRight').append(websiteElement, ratingElement, directionsElement);
				var foodElement = $('<div>').addClass('listing').append(foodElementLeft, foodElementMid, foodElementRight);
				userFoodSelection.push(foodElement);
			}
		};
		if ($('#foodRating').val() === 'lowRated') {
			if (rating < 6) {
				var foodElementLeft = $('<div>').addClass('listingLeft').append(imageElement);
				var foodElementMid = $('<div>').addClass('listingMid').append(nameElement, formattedAddressElement);
				var foodElementRight = $('<div>').addClass('listingRight').append(websiteElement, ratingElement, directionsElement);
				var foodElement = $('<div>').addClass('listing').append(foodElementLeft, foodElementMid, foodElementRight);
				userFoodSelection.push(foodElement);
			}
		};
		
	}); // end of foodSpots forEach
	userFoodSelection = _.shuffle(userFoodSelection).slice(0,4);
	if (userFoodSelection.length > 0) {
		$('#food').append(userFoodSelection);
	} else {
		$('#food').append($('<p>').text("Sorry, there were no results matching your search"))
	}

	$('.decideContainer').one('click', '.decide', function(e) {
		e.preventDefault();
		$('.decideResults').append(userFoodSelection[Math.floor(Math.random() * userFoodSelection.length)], userBrewSelection[Math.floor(Math.random() * userBrewSelection.length)]);
		$('.selection').css('display', 'flex').fadeIn(4000);
		$('html, body').animate({
	         scrollTop: $(".selection").offset().top
	       }, 1000);
	});
	$('.startOver').one('click', function(e) {
		location.reload();
	})
	$('html, body').animate({
         scrollTop: $(".results").offset().top
       }, 1000);
} //end display results


$(function() {
	brewApp.init();

})