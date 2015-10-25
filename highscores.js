$.fn.hexxedHighScores = function(settings) {
	// keep track of where in local storage the scores will be held
	// using a variable to ensure consistency among all calls
	var HEXXED_STORAGE_NAME = '_hexxedHighScores';

	function loadHighScores() {
		if(window.localStorage !== undefined) {
			var data = JSON.parse(localStorage.getItem(HEXXED_STORAGE_NAME));
			console.log(data);
			console.log(data);
			if(!data) {
				var td = $('<td>').text('No scores found!');
				$('#tableBody').append($('<tr>').append(td.attr('colspan', '5')));
				$('#hsErase').remove();
			} else {
				data = data.sort(function(a, b) {
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
				});

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
			alert("Sorry, your browser does not support local storage.");
		}
	}

	function eraseHighScores() {
		localStorage.removeItem(HEXXED_STORAGE_NAME);
		loadHighScores();
	}

	this.append($('<h1>').text('Hexxed: High Scores'));

	var scoresTable = $('<table>').attr('id', 'scoreTable');
	var tableHeader = $('<thead>').html('<tr>' +
										'<th>Player Name</th>' +
										'<th>Difficulty</th>' +
										'<th># Turns</th>' +
										'<th>Final Score</th>' +
										'<th>Timestamp</th>' +
										'</tr>');

	scoresTable.append(tableHeader);
	scoresTable.append($('<tbody>').attr('id', 'tableBody'));

	this.append(scoresTable);

	this.append($('<button>').click(eraseHighScores).text('Erase Scores').attr('id', 'hsErase'));

	loadHighScores();

	return this;
};

$(document).ready(function() {
	$('#hexxedScores').hexxedHighScores();
});
