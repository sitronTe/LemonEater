/**
 * Testing area
 */
var koo = 1;
function testWriter() {
	// writing some to
	var output= '<p class="lemon-background">';
	output += '<span id="span1" class="lemon-eater-head">&nbsp;</span><span id="span2" class="lemon-eater-body">&nbsp;</span><br>';
	output+='</p><p class="lemon-background">';
	output+='<span id="span3" class="lemon-background">&nbsp;</span><span id="span4" class="lemon-eater-body">x</span>';
	output+='</p>';
	output+='<input type="button" value="alterclass" onclick="alterClass()" />';
	document.getElementById("lemonEater").innerHTML=output;
}
function alterClass() {
	if (koo==1) {
		document.getElementById("span3").className="lemon-eater-body";
		koo++;
	} else {
		document.getElementById("span3").className="";
		koo=1;
	}
}

/**
 * The game lemon eater follows.
 */

var width = 80;
var height = 50;
// Empty is a simplification of a space that shows on screen.
var empty = "&nbsp;";
// RefreshRate is how often (in milliseconds) the level will be updated
var refreshRate = 333;

/**
 * Initialize game
 */
function lemonInit() {
	lemonDrawBoard();
	setInterval("lemonTick()",refreshRate);
}

/**
 * Draws our empty game board. Must be further initialized for every level
 */
function lemonDrawBoard() {
	var b="";
	for (var h=0; h<height; h++) {
		b+='<p id="lemon-line-'+h+'class="lemon-background">';
		for (var w=0; w<width; w++){
			b+='<span id="lemon-cell-h'+h+'-w'+w+'>'+empty+'</span>';
		}
		b+="</p>";
	}
}

/**
 * Clears the entire board. That is it removes all information visible in all cells.
 */
function lemonClearBoard() {
	for (var h=0; h<height; h++) {
		for (var w=0; w<width; w++) {
			document.getElementById('lemon-cell-h'+h+'-w'+w).innerHTML=empty;
			document.getElementById('lemon-cell-h'+h+'-w'+w).className="";
		}
	}
}

function lemonTick() {
	// What happens every tick
}