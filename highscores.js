$.fn.hexxedHighScores = function(settings) {
	// keep track of where in local storage the scores will be held
	// using a variable to ensure consistency among all calls
	var HEXXED_STORAGE_NAME = '_hexxedHighScores';

	/**
	 * Determines sorting order for two high scores based on their score from
	 * high to low, followed by their name lexicographically from low to high
	 * @param  {Object} a a color for comparison
	 * @param  {Object} b the other color for comparison
	 * @return {int}   the sort result (-1 for less, 1 for greater, 0 for equal)
	 */
	function sortScores(a, b) {
		if(parseFloat(a.score) < parseFloat(b.score)) {
			return 1;
		} else if(parseFloat(a.score) > parseFloat(b.score)) {
			return -1;
		} else {
			if(a.name < b.name) {
				return 1;
			} else if(a.name > b.name) {
				return -1;
			} else {
				return 0;
			}
		}
	}

	/**
	 * Loads the high scores and inputs them into the table in sorted order
	 */
	function loadHighScores() {
		// Check for local storage in browser
		if(window.localStorage !== undefined) {
			// Load the data from the local storage
			var data = JSON.parse(localStorage.getItem(HEXXED_STORAGE_NAME));

			// Check if there's data present
			if(!data) {
				// Add a full-width row explaining that there's no data
				var td = $('<td>').text('No scores found!');
				$('#tableBody').append($('<tr>').append(td.attr('colspan', '5')));

				// Hide the erase button, as there's nothing to erase
				$('#hsErase').remove();
			} else {
				// Sort the data using the sort function
				data = data.sort(sortScores);

				// Process and add each row
				for(var x = 0; x < data.length; x++) {
					var row = $('<tr>');
					row.append($('<td>').text(data[x].name));
					row.append($('<td>').text(data[x].difficulty));
					row.append($('<td>').text(data[x].turns));
					row.append($('<td>').text(data[x].score));
					row.append($('<td>').text(data[x].timestamp));
					$('#tableBody').append(row);
				}
			}
		} else {
			// Add a full-width row explaining the lack of local storage
			var td = $('<td>').text('Sorry, your browser does not support local storage.');
			$('#tableBody').append($('<tr>').append(td.attr('colspan', '5')));

			// Hide the erase button, as there's nothing to erase
			$('#hsErase').remove();
		}
	}

	function eraseHighScores() {
		// remove the item from local storage
		localStorage.removeItem(HEXXED_STORAGE_NAME);

		// reload the table using the load function, which will be blank
		loadHighScores();
	}

	// Add a title to explain page's purpose
	this.append($('<h1>').text('Hexxed: High Scores'));

	// create a table to be populated with scores
	var scoresTable = $('<table>').attr('id', 'scoreTable');

	// create a table header
	var tableHeader = $('<thead>').html('<tr>' +
										'<th>Player Name</th>' +
										'<th>Difficulty</th>' +
										'<th># Turns</th>' +
										'<th>Final Score</th>' +
										'<th>Timestamp</th>' +
										'</tr>');

	// add the table header to the table
	scoresTable.append(tableHeader);

	// create a table body element for future population
	scoresTable.append($('<tbody>').attr('id', 'tableBody'));

	// add the table to the page
	this.append(scoresTable);

	// Create a button to allow for erasing all high score records
	var eraseButton = $('<button>').text('Erase Scores').attr('id', 'hsErase');

	// Add the erase button
	this.append(eraseButton.click(eraseHighScores));

	// Load the scores
	loadHighScores();

    // Returns the jQuery object for chained jQuery calls
	return this;
};

$(document).ready(function() {
    // Create a high scores instance in the div entitled hexxedScores
	$('#hexxedScores').hexxedHighScores();
});
