function main() {
	newColor();
}

function newColor() {
	//get random color
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("color").style.backgroundColor = color;
}