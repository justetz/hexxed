function main() {
	newColor();
	$("#sliders").children().slider({
		min:0,
		max:255,
		slide: function(event, ui) {}
	});
	var values = $("#sliders").children().slider("value");

}

function newColor() {
	//get random color
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("color").style.backgroundColor = color;
}

