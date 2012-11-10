/*
 * Testing area
 */
var koo = 1;
function testWriter() {
	// writing some to
	var output = '<p class="lemon-background">';
	output += '<span id="span1" class="lemon-eater-head">&nbsp;</span><span id="span2" class="lemon-eater-body">&nbsp;</span><br>';
	output += '</p><p class="lemon-background">';
	output += '<span id="span3" class="lemon-background">&nbsp;</span><span id="span4" class="lemon-eater-body">x</span>';
	output += '</p>';
	output += '<input type="button" value="alterclass" onclick="alterClass()" />';
	document.getElementById("lemonEater").innerHTML = output;
}
function alterClass() {
	if (koo == 1) {
		document.getElementById("span3").className = "lemon-eater-body";
		koo++;
	} else {
		document.getElementById("span3").className = "";
		koo = 1;
	}
}
/*
 * Objects area - lemonEater -> an eater of lemons.
 */

/**
 * Creates a new lemonEater. Placed at (placeX,placeY). Length minimum set to 1.
 * Direction is either (n)orth, (s)outh, (e)ast or (w)est. If none of these,
 * direction is set to (n)orth.
 * 
 * @param placeX
 *            x- position lemonEater should start
 * @param placeY
 *            y- position lemonEater should start
 * @param length
 *            length of lemonEater. Minimum set to 4
 * @param direction
 *            direction to start moving in
 * @returns null
 */
function LemonEater(placeX, placeY, length, direction) {
	this.dx = 0;
	this.dy = 0;
	this.setDirection = setEaterDirection;
	this.setDirection(direction);
	this.x = placeX * 1;
	this.y = placeY * 1;
	if (length > 0)
		this.length = length;
	else
		this.length = 1;
}

/**
 * lemonEater direction change. (n)orth, (s)outh, (e)ast or west.
 * 
 * @param direction
 *            direction to move in.
 * @returns null
 */
function setEaterDirection(direction) {
	switch (direction) {
	case 's':
		this.dy = 1;
		this.dx = 0;
		break;
	case 'w':
		this.dy = 0;
		this.dx = -1;
		break;
	case 'e':
		this.dy = 0;
		this.dx = 1;
		break;
	default:
		this.dy = -1;
		this.dx = 0;
	}
}
/**
 * A single tick of the LemonEater
 */
function eaterTick() {
	this.x+=this.dx;
	if (this.x<0)
		this.x=width-1;
	if (this.x>=width)
		this.x=0;
	this.y+=this.dy;
	if (this.y<0)
		this.y=heigth-1;
	if (this.y>=height)
		this.y=0;
	// TODO perform some checks if we are alive.
	// TODO Make something for animation.
}

/*
 * The game lemon eater follows.
 */

var width = 80;
var height = 30;
// Empty is a simplification of a space that shows on screen.
var empty = "&nbsp;";
// RefreshRate is how often (in milliseconds) the level will be updated
var refreshRate = 100;
var started = false;
var testCellX = width - 1;
var testCellY = height - 1;

/**
 * Initialize the game
 */
function lemonInit() {
	var koo = new LemonEater(5, 1, 3, 'w');
	alert('dx: '+ koo.dx + ' dy: ' + koo.dy);
	koo.setDirection('e');
	alert('dx: '+ koo.dx + ' dy: ' + koo.dy);
	lemonDrawBoard();
	setInterval("lemonTick()", refreshRate);
}

/**
 * Draws our empty game board. Must be further initialized for every level
 */
function lemonDrawBoard() {
	var b = "";
	for ( var y = 0; y < height; y++) {
		b += '<span id="lemon-line-' + y + '" class="lemon-background">';
		for ( var x = 0; x < width; x++) {
			b += '<span id="lemon-cell-x' + x + '-y' + y + '">' + empty
					+ '</span>';
		}
		b += "</span><br />";
	}
	document.getElementById("lemonEater").innerHTML = b;
}

/**
 * Clears the entire board. That is it removes all information visible in all
 * cells.
 */
function lemonClearBoard() {
	for ( var y = 0; y < height; y++) {
		for ( var x = 0; x < width; x++) {
			document.getElementById('lemon-cell-x' + x + '-y' + y).innerHTML = empty;
			document.getElementById('lemon-cell-x' + x + '-y' + y).className = "";
		}
	}
}

/**
 * What happens when timer ticks.
 */
function lemonTick() {
	if (started) {
		lemonGameTick();
	}

	// Testing animation, since game cannot start at this moment, no problem.
	document.getElementById('lemon-cell-x' + testCellX + '-y' + testCellY).innerHTML = empty;
	document.getElementById('lemon-cell-x' + testCellX + '-y' + testCellY).className = "lemon-eater-body";
	testCellX--;
	if (testCellX < 0)
		testCellX = width - 1;
	testCellY--;
	if (testCellY < 0)
		testCellY = height - 1;
}

/**
 * If game is started, this should happen
 */
function lemonGameTick() {
	//
}