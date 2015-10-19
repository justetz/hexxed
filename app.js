$(document).ready(function() {
	var sliderObject = {
		min:0,
		max:255,
		slide: function(event, ui) {
			$('#' + event.target.id + 'Val').html($("#"+event.target.id).slider("option", "value"));
		}
	};

	$( "#red" ).slider(sliderObject);
	$( "#green" ).slider(sliderObject);
	$( "#blue" ).slider(sliderObject);
});

/*
<script>
var rvalue = $("#red").slider("option", "value");
var gvalue = $("#green").slider("option", "value");
var bvalue = $("#blue").slider("option", "value");
</script>*/

function main() {
	newColor();
}

function newColor() {
	//get random color
	var color = '#'+Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("color").style.backgroundColor = color;
}
