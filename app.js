function main() {
	newColor();
	var color = document.getElementById("sliders");
	var child = color.childNodes;
	for(var i = 0; i < child.length; ++i) {
		child.slider();
	}
}

function newColor() {
	//get random color
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("color").style.backgroundColor = color;
}

