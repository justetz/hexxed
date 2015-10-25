// Ensures the browser executes the following code in strict mode
"use strict";

/**
 * The Hexxed jQuery plugin generates a fully-functioning, self-contained color
 * guessing game.
 * @return {jQuery} The jQuery object for chained calls
 * @author Anjin Lima <limaa@rpi.edu>
 * @author Tristan Villamil <villat2@rpi.edu>
 * @autor Justin Etzine <etzinj@rpi.edu>
 */
$.fn.hexxed = function(settings) {

    /**
     * Input parameter validation:
     * Configures settings object. If the user excluded one, it gets defined
     * with default values. Otherwise, it ensures the values are legal.
     */
    if(!settings) {
        // Settings object not passed as argument, generate one.
        settings = {
            difficulty: 5,
            turns: 10
        };
    } else {
        // Settings object passed, must verify settings as valid

        // Check difficulty setting (0-10)
        if(!settings.difficulty) {
            settings.difficulty = 5;
        } else if(settings.difficulty > 10) {
            settings.difficulty = 10;
        } else if(settings.difficulty < 0) {
            settings.difficulty = 0;
        }

        // Check difficulty setting (1+)
        if(!settings.turns) {
            settins.turns = 10;
        } else if(settings.turns < 1) {
            settings.turns = 1;
        }
    }

    /**
     * Contains the color that user is trying to guess
     * @type {Object}
     */
    var color = { red: 0, green: 0, blue: 0 };

    /**
     * Contains the user's guess
     * @type {Object}
     */
    var guess = { red: 127, green: 127, blue: 127 };

    /**
     * Logs the time (in milliseconds) when a color is loaded, so we can
     * determine the time elapsed when calculating score.
     */
    var time_at_load = Date.now();

    /**
     * Keeps track of of how many points are earned across all turns played
     */
    var total_score = 0;

    /**
     * Tracks how many turns remain before end of game is invoked.
     */
    var turns_remaining = settings.turns;

    /**
     * Creates a new jQuery reference to the game element for DOM manipulation
     */
    var gameElement = this;

    /**
     * Serves as the reusable object that's passed as an argument when creating
     * the sliders.
     * @type {Object}
     */
    var sliderObject = {
        min:0,
        max:255,
        value: 127,
        slide: updateGuess,
        stop: updateGuess
    };

    /**
     * This function is applied to the slide and stop arguments of the slider
     * jquery objects for the Hexxed game, and keeps the variables up to date
     * @param  {Object} event
     * @param  {Object} ui
     */
    function updateGuess(event, ui) {
        // determine which slider called the function
        var sliderColor = event.target.id;

        // get the value from that slider
        var value = $('#' + sliderColor).slider('option', 'value');

        // Update the respective numerical indicator with the value
        $('#' + sliderColor + 'Val').html(value);

        // Update the guess object with the value
        guess[sliderColor] = parseInt(value);

        // Prepare the guess colors in CSS RGB format for applying to the div
        var color_string = 'rgb(' + guess.red + ',' +
                                    guess.green + ',' +
                                    guess.blue + ')';

        // Apply the new guess to the #guess div.
        $('#guess').css('background', color_string);
    }

    /**
     * Generates a new color, adds it to the designated html element, and
     * updates the color object.
     */
    function newColor() {
        //get random color RGB components
        color.red   = Math.floor(Math.random()*255);
        color.blue  = Math.floor(Math.random()*255);
        color.green = Math.floor(Math.random()*255);

        // Prepare the guess colors in CSS RGB format for applying to the div
        var color_string = 'rgb(' + color.red   + ',' +
                                    color.green + ',' +
                                    color.blue  + ')';

        // Apply the new color to the #color div.
        $('#color').css('background', color_string);

        // Log the current time in milliseconds, used in score calculations
        time_at_load = Date.now();
    }

    /**
     * Called by the start over button after ending the game.
     */
    function reset() {
        // remove the elements available to the user at game over
        $('#gameOver').remove();

        // show the game board
        gameElement.children().show();

        // generate a new color
        // done after showing game board because newColor resets the timer
        newColor();

        // reset the score counter
        final_score = 0;

        // restore turns as defined in settings
        turns_remaining = settings.turns;

        // clear results, as there wouldn't be any
        $('#result').text("");
    }

    /**
     * Checks the user's guess against the designated color and generates a
     * score based on a number of factors
     */
    function check() {
        // Determine milliseconds elapsed since the color was loaded
        var milliseconds_taken = Date.now() - time_at_load;

        // Calculate the percents that the user was off
        var percents = {
            red: (Math.abs(color.red - guess.red)/255)*100,
            green: (Math.abs(color.green - guess.green)/255)*100,
            blue: (Math.abs(color.blue - guess.blue)/255)*100
        };

        // Calculate the average (overall) percent off
        var percent_off = (percents.red + percents.green + percents.blue)/3;

        // Calculate the turn's score
        var turn_score = ((15 - settings.difficulty - percent_off) /
                          (15 - settings.difficulty)) *
                         (15000 - milliseconds_taken);

        // If positive, round to 2 decimals. If negative, set to 0.
        turn_score = (turn_score > 0) ? (Math.round(turn_score*100)/100) : 0;

        // Add the score for the turn to the running total
        total_score += turn_score;

        turns_remaining--;
        if(turns_remaining > 0) {
            newColor();
            
            // Display the current statistics
            $('#result').html("Last Score: "    + turn_score  +
                              "; Total Score: " + total_score + 
                              "; Turns Left: "  + turns_remaining);

        } else {
            // create a new div element to display game over info for the user
            // wrapped in a div for easy removing on game reset
            var gameOver = $('<div>').attr('id', 'gameOver');
            
            // Add a header to denote game over
            gameOver.append($("<h2>").text("Game Over!"));
            
            // 
            gameOver.append($("<p>").text("Final Score: " + total_score));
            
            gameOver.append($('<hr>'));
            
            var playerNameInput = $('<input>').attr('placeholder', 'Your name');
            gameOver.append(playerNameInput.attr('id', 'hsName'));
            
            var submit = $('<button>').text("Submit High Score!");
            submit = submit.attr("type", "button").attr("id","hsSubmit");
            gameOver.append(submit.click(submitHighscore));
            
            gameOver.append($('<hr>'));
            
            gameOver.append($("<button>").attr("type", "button").text("Try Again!").click(reset));

            gameElement.children().hide();
            gameElement.append(gameOver);
        }
    }

    /**
     * @param  {string} playerName
     */
    function submitHighscore() {
        // keep track of where in local storage the scores will be held
        // using a variable to ensure consistency among all calls
        var HEXXED_STORAGE_NAME = '_hexxedHighScores';

        // get the player's information from the designated input element
        var playerName = $('#hsName').val();

        // check to make sure the user included their name, otherwise terminate
        if(playerName === "") {
            alert("You need to enter your name to submit a high score!");
            return;
        }

        // compile the information to be inputted
        var dataForSubmission = {
            name: playerName,
            difficulty: settings.difficulty,
            turns: settings.turns,
            score: total_score,
            timestamp: new Date().toLocaleString()
        };

        // ensure the browser has the capacity for local storage
        if(window.localStorage !== undefined) {
            // query local storage for any data currently present
            var data = localStorage.getItem(HEXXED_STORAGE_NAME);

            // Determine if to add or create a high scores JSON array
            if(!data) {
                // no exisiting data, create a new array with the one score
                data = [dataForSubmission];
            } else {
                // exisiting data, parse the exisiting and add the new
                data = JSON.parse(data);
                data.push(dataForSubmission);
            }
            // convert the JSON back to a string
            data = JSON.stringify(data);

            // push the newly modified / created data to local storage.
            localStorage.setItem(HEXXED_STORAGE_NAME, data);
        } else {
            // otherwise, notify the user
            alert("Sorry, your browser does not support local storage.");
        }
    }

    // ==================================
    //  DOM Preparation
    //  Adding the game elements to the HTML
    // ==================================

    // Display the color user is trying to match
    this.append($('<div>').attr('id', 'color').text("Your Goal"));

    // Display the user's current guess color
    this.append($('<div>').attr('id', 'guess').text("Your Guess"));

    // Clears the floats
    this.append($('<hr>'));

    // Button that generates new color
    var newColorBtn = $('<button>').attr('type','button').attr('id', 'new');

    // Adds the button to the DOM with text and an action on click
    this.append(newColorBtn.text('Try a different color').click(newColor));

    // The sliders the user can manipulate
    // Red slider
    this.append($('<div>').attr('id', 'red').slider(sliderObject));

    // Green slider
    this.append($('<div>').attr('id', 'green').slider(sliderObject));

    // Blue slider
    this.append($('<div>').attr('id', 'blue').slider(sliderObject));

    // Current value indicators
    var redVal = $('<span>').attr('id', 'redVal').text(guess.red),
        greenVal = $('<span>').attr('id', 'greenVal').text(guess.green),
        blueVal = $('<span>').attr('id', 'blueVal').text(guess.blue),
        // The wrapping <p> to store the value indicators
        currentVals = $('<p>').attr('id', 'currentVals');

    // append the indicators to the <p> with helpful text descriptions
    currentVals.append('Current: Red ').append(redVal);
    currentVals.append('; Green ').append(greenVal);
    currentVals.append('; Blue ').append(blueVal);

    // add the value indicator p to the DOM
    this.append(currentVals);

    // Submit button
    var submitBtn = $('<button>').attr('type', 'button').attr('id', 'submit');

    // Add the button to the DOM with text and a function to complete on click
    this.append(submitBtn.text('Check my Color!').click(check));

    // Result area
    this.append($('<div>').attr('id', 'result'));

    // Generate first color
    newColor();

    // Returns the jQuery object for chained jQuery calls
    return this;
}

$(document).ready(function() {
    // Create a game instance in the div entitled hexxed.
    $('#hexxed').hexxed();
});