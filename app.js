/**
 * The Hexxed jQuery plugin generates a fully-functioning, self-contained color
 * guessing game.
 * @return {jQuery} The jQuery object for chained calls
 */
$.fn.hexxed = function() {
	/**
	 * Contains the color that user is trying to guess
	 * @type {Object}
	 */
	var color = { red: 0, green: 0, blue: 0 };

	/**
	 * Contains the user's guess
	 * @type {Object}
	 */
	var guess = { red: 0, green: 0, blue: 0 };

	/**
	 * This function is applied to the slide and stop arguments of the slider
	 * jquery objects for the Hexxed game.
	 * @param  {Object} event
	 * @param  {Object} ui
	 */
	var updateFunction = function(event, ui) {
		var sliderColor = event.target.id;
		var value = $("#" + sliderColor).slider("option", "value");

		$('#' + sliderColor + 'Val').html(value);
		guess[sliderColor] = parseInt(value);
	};

	/**
	 * Serves as the reusable object that's passed as an argument when creating
	 * the sliders.
	 * @type {Object}
	 */
	var sliderObject = {
		min:0,
		max:255,
		slide: updateFunction,
		stop: updateFunction
	};

	function newColor() {
		//get random color
		color.red   = Math.floor(Math.random()*255);
		color.blue  = Math.floor(Math.random()*255);
		color.green = Math.floor(Math.random()*255);

		var color_string = "rgb(" + color.red + "," + color.blue + "," + color.green + ")";

		document.getElementById("color").style.backgroundColor = color_string;
	}

	function check() {
		var score = {
			red: (Math.abs(color.red - guess.red)/255)*100,
			green: (Math.abs(color.green - guess.green)/255)*100,
			blue: (Math.abs(color.blue - guess.blue)/255)*100
		};

		var average = (score.red + score.green + score.blue)/3;
		$("#currentVals").html("Percent: " + average);

		if(average === 100) {
			$("#currentVals").html("Match!");
		}
	}

	// Display the color user is trying to match
	this.append($('<div>').attr("id", "color"));

	// Gets new color
	this.append($('<button>').attr("type","button").attr("id", "new").click(newColor).text("Try a different color"));

	// The sliders the user can manipulate

	// Red slider
	this.append($('<div>').attr("id", "red").slider(sliderObject));

	// Green slider
	this.append($('<div>').attr("id", "green").slider(sliderObject));

	// Blue slider
	this.append($('<div>').attr("id", "blue").slider(sliderObject));

	// Current value indicators
	var redVal = $('<span>').attr('id', 'redVal').text('0'),
		greenVal = $('<span>').attr('id', 'greenVal').text('0'),
		blueVal = $('<span>').attr('id', 'blueVal').text('0'),
		currentVals = $('<p>').attr("id", "currentVals");

	currentVals.append('Current: Red ').append(redVal);
	currentVals.append('; Green ').append(greenVal);
	currentVals.append('; Blue ').append(blueVal);

	this.append(currentVals);

	// Submit button
	this.append($('<button>').attr("type", "button").attr("id", "submit").text("Submit!").click(check));

	// Result area
	this.append($('<div>').attr("id", "result"));

	newColor();

	return this;
}

$(document).ready(function() {
	$("#hexxed").hexxed();
});
