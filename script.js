// Homework 2
function main() {
	//start of recursion outputs to tags variable
	var tags = get(document, "");

	//Places the variable to document
	document.getElementById("info").innerHTML = tags;

	//clones and appends first part
	var clone = document.getElementById("fav").cloneNode(true);
	document.body.appendChild(clone);

	//css
	var divs = document.getElementsByTagName("div");

	for(var i = 0; i < divs.length; ++i){
		divs[i].onmouseover = function(){
			this.style.paddingLeft = "10px";
			this.style.backgroundColor = "blue";
		};
		divs[i].onmouseout = function(){
			this.style.paddingLeft = "0px";
			this.style.backgroundColor = "white";
		};
	}
}

function get(curr, depth) {
	//gets all children
	var childs = curr.childNodes;
	if(curr.tagName != undefined){
		curr.addEventListener("click", function(){ alert(curr.tagName); }, false);
	}

	//initializes string
	var str = "";

	//goes through all children
	for(var i = 0; i < childs.length; ++i){
		if(childs[i].tagName != undefined){
			str += depth + childs[i].tagName + "\n";

			//on click alert this
			str += get(childs[i], depth + "-");
		}
	}

	//returns final string
	return str;
}
