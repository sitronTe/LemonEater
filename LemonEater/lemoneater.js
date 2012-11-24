/*
 * Objects area -
 * 	LemonCounter -> Keeps track of points and lives.
 * 	LemonPoint -> a 2 dimensional point.
 * 	LemonLemon -> a lemon to eat! Yummi!
 * 	LemonEater -> an eater of lemons.
 * 	LemonBoard -> a place to move around. Loaded with lemons!
 */

/**
 * Creates a new counter for this game.
 * 
 * @param lives
 *            how many lives you are supposed to have.
 */
function LemonCounter(lives) {
	this.points = 0;
	this.lemonsEaten = 0;
	this.lives = lives * 1;
	this.eaterDied = counterKill;
	this.tick = counterTick;
	this.eat = counterEat;
	this.printLives = counterOutLives;
	this.printLives();
	this.printPoints = counterOutPoints;
	this.printPoints();
	this.printEatenLemons = counterOutLemonsEaten;
	this.printEatenLemons();
}

/**
 * counts down a life and removes some points.
 */
function counterKill() {
	this.lives--;
	this.points - 50;
	this.lemonsEaten = 0;
	if (this.points < 0) {
		this.points = 0;
	}
	if (this.lives < 0) {
		this.lives = 0;
		// TODO GAME OVER!!!
	}
	this.printPoints();
	this.printLives();
	this.printEatenLemons();
}

/**
 * A tick of a LemonCounter
 */
function counterTick() {
	if (this.points > 0)
		this.points--;
	this.printPoints();
}

/**
 * To keep track of point and lemons eaten.
 */
function counterEat() {
	this.lemonsEaten++;
	this.points += 100;
	this.points += 10 * this.lemonsEaten;
	this.printPoints();
	this.printEatenLemons();
}

function counterOutLives() {
	var l = this.lives;
	document.getElementById('lemon-cell-x1-y1').innerHTML = l % 10;
	l = Math.floor(l / 10);
	document.getElementById('lemon-cell-x0-y1').innerHTML = l % 10;
}

function counterOutPoints() {
	var p = this.points;
	for ( var i = 5; i >= 0; i--) {
		document.getElementById('lemon-cell-x' + i + '-y0').innerHTML = p % 10;
		p = Math.floor(p / 10);
	}
}

function counterOutLemonsEaten() {
	var l = this.lemonsEaten;
	for ( var i = 5; i >= 3; i--) {
		document.getElementById('lemon-cell-x' + i + '-y1').innerHTML = l % 10;
		l = Math.floor(l / 10);
	}
}

/**
 * Creates a new LemonPoint. Sets x and y values according to arguments.
 * 
 * @param placeX
 *            x-position of point
 * @param placeY
 *            y-position of point
 */
function LemonPoint(placeX, placeY) {
	this.x = placeX * 1;
	this.y = placeY * 1;
}

/**
 * Creates a delicious lemon! Placed at the place brought along. Yummi!
 * 
 * @param place
 *            position of the lemon
 */
function LemonLemon(place) {
	this.place = new LemonPoint(place.x, place.y);
}

/**
 * Creates a new LemonEater. Placed at lemonPoint. Length minimum set to 1.
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
 * @param context
 *            LemonBoard this LemonEater lives in.
 * @returns null
 */
function LemonEater(place, length, direction, context) {
	this.alive = true;
	this.allowDirectionChange = true;
	this.ownerBoard = context;
	this.lemonsEaten = 0;
	this.previousLength = 1;
	this.x = place.x;
	this.y = place.y;
	this.dx = 0;
	this.dy = 0;
	this.setDirection = setEaterDirection;
	this.tick = eaterTick;
	this.setDirection(direction);
	this.contains = eaterContains;

	this.positions = new Array();
	this.positions[0] = new LemonPoint(place.x, place.y);
	if (length > 0)
		this.length = length;
	else
		this.length = 1;
	// Animation functions
	this.drawHead = eaterDrawHead;
	this.drawBody = eaterDrawBody;
	this.drawDeath = eaterDrawDeath;
	this.drawHead(this.positions[0]);
}

/**
 * Checks if a point is in this eater.
 * 
 * @param point
 *            the place to check
 * @returns {Boolean} if if contained the point.
 */
function eaterContains(point) {
	for ( var i = 0; i < this.positions.length; i++) {
		if ((this.positions[i].x == point.x)
				&& (this.positions[i].y == point.y)) {
			return true;
		}
	}
	return false;
}

/**
 * Draws eater death to this position
 * 
 * @param point
 *            where the dead element is drawn
 */
function eaterDrawDeath(point) {
	document.getElementById('lemon-cell-x' + point.x + '-y' + point.y).className = 'lemon-eater-death';
}

/**
 * Draws eater head to this position
 * 
 * @param point
 *            where the head is drawn
 */
function eaterDrawHead(point) {
	document.getElementById('lemon-cell-x' + point.x + '-y' + point.y).className = 'lemon-eater-head';
}

/**
 * Draws eater body to this position
 * 
 * @param point
 *            where the body is drawn
 */
function eaterDrawBody(point) {
	document.getElementById('lemon-cell-x' + point.x + '-y' + point.y).className = 'lemon-eater-body';
}

/**
 * lemonEater direction change. (n)orth, (s)outh, (e)ast or west.
 * 
 * @param direction
 *            direction to move in.
 * @returns null
 */
function setEaterDirection(direction) {
	if (this.allowDirectionChange) {
		switch (direction) {
		case 's':
			if (this.dy != -1) {
				this.dy = 1;
				this.dx = 0;
				this.allowDirectionChange = false;
			}
			break;
		case 'w':
			if (this.dx != 1) {
				this.dy = 0;
				this.dx = -1;
				this.allowDirectionChange = false;
			}
			break;
		case 'e':
			if (this.dx != -1) {
				this.dy = 0;
				this.dx = 1;
				this.allowDirectionChange = false;
			}
			break;
		default:
			if (this.dy != 1) {
				this.dy = -1;
				this.dx = 0;
				this.allowDirectionChange = false;
			}
		}
	}
}

/**
 * A single tick of the LemonEater
 */
function eaterTick() {
	this.x += this.dx;
	if (this.x < 0)
		this.x = width - 1;
	if (this.x >= width)
		this.x = 0;
	this.y += this.dy;
	if (this.y < 0)
		this.y = height - 1;
	if (this.y >= height)
		this.y = 0;
	this.allowDirectionChange = true;
	var point = new LemonPoint(this.x, this.y);
	// Survive check
	var pointNotOk = this.contains(point) || this.ownerBoard.isWall(point);
	if (pointNotOk || !this.alive) {
		if (this.alive) {
			this.alive = false;
			for ( var i = 0; i < this.positions.length; i++) {
				// Draw all segments as dead
				this.drawDeath(this.positions[i]);
			}
		} else if (this.positions.length > 0) {
			var rem = Math.floor(this.positions.length / 9) + 1;
			for ( var i = 0; i < rem; i++) {
				var killSegment = this.positions.pop();
				this.ownerBoard.release(killSegment);
			}
		} else {
			this.ownerBoard.killEater();
		}
	} else {
		// consume lemon check
		if (this.ownerBoard.consumeLemon(point)) {
			var l = this.previousLength + this.length;
			this.previousLength = this.length;
			this.length = l;
		}
		// Animation tasks
		this.drawHead(point);
		this.drawBody(this.positions[0]);
		// if we are too long, remove last item and release it.
		if (this.positions.length > this.length) {
			var rel = this.positions.pop();
			this.ownerBoard.release(rel);
		}
		// add to our positions. This is done after item removal to ensure that
		// length is body length without head.
		for ( var i = this.positions.length; i > 0; i--) {
			this.positions[i] = this.positions[i - 1];
		}
		this.positions[0] = point;
	}
}

/**
 * Creates a new LemonBoard. When completed, start position and walls should be
 * presented to this as a String. Right now this variable does nothing.
 * 
 * @param boardAsString
 *            a String representation of the board
 */
function LemonBoard(boardAsString, counter) {
	// TODO Make way to analyze string so that we can get different boards.
	// First string analyser only reads signs without newlines. Prefixed size.
	// So, board will be 80*30=2400 signs large. L is startposition. Number is
	// wall, or not.
	// TODO Decide board size, and redraw as necessary
	/*
	 * width,height,startx,starty,uncompressedwallnumbers. another sign than .
	 * at the end indicates something more?
	 */
	var desciferedString = boardAsString; // will be altered later.
	this.counter = counter;
	this.lemon = new LemonLemon(new LemonPoint(-1, -1));
	this.setWall = boardSetWall;
	this.walls = new Array();
	this.start = new LemonPoint(0, 0);
	for ( var y = 0; y < height; y++) {
		this.walls[y] = new Array();
		for ( var x = 0; x < width; x++) {
			var v = desciferedString[width * y + x];
			if (v == 'L') {
				this.setWall(x, y, 0);
				this.start = new LemonPoint(x, y);
			} else {
				this.setWall(x, y, v * 1);
			}
		}
	}
	// TODO If end not reached, do something.
	this.eater = new LemonEater(this.start, 1, 'e', this);
	this.isWall = boardWall;
	this.isLemon = boardIsLemon;
	this.tick = boardTick;
	this.spawnLemon = boardSpawnLemon;
	this.release = boardRelease;
	this.spawnLemon();
	this.consumeLemon = boardConsume;
	this.setEaterDirection = boardEaterDirection;
	this.killEater = boardSpawnEater;
}

/**
 * Sets a wall segment and updates graphics.
 * 
 * @param x
 *            x-position
 * @param y
 *            y-position
 * @param w
 *            wall value
 */
function boardSetWall(x, y, w) {
	this.walls[y][x] = w;
	if (w > 0)
		document.getElementById('lemon-cell-x' + x + '-y' + y).className = 'lemon-wall-'
				+ w;
	else
		document.getElementById('lemon-cell-x' + x + '-y' + y).className = '';
}

/**
 * Spawns a LemonEater at start location, and notifies counter to count down
 * lives.
 */
function boardSpawnEater() {
	this.eater = new LemonEater(this.start, 1, 'e', this);
	this.counter.eaterDied();
}

/**
 * Sets this boards eaters direction.
 */
function boardEaterDirection(direction) {
	this.eater.setDirection(direction);
}

/**
 * Checks if the point of interest is a wall.
 * 
 * @param point
 *            point to check
 * @returns {Boolean} if this is a wall segment.
 */
function boardWall(point) {
	var isWall = this.walls[point.y][point.x] > 0;
	return isWall;
}

/**
 * Tries to consume lemon at this point. If no lemon present, return false.
 * 
 * @param point
 *            point to check
 * @returns {Boolean} if a lemon was eaten.
 */
function boardConsume(point) {
	var isLemon = this.isLemon(point);
	if (isLemon) {
		this.lemon = this.spawnLemon();
		this.counter.eat();
	}
	return isLemon;
}

/**
 * Checks if there is a lemon on this point
 * 
 * @param point
 *            point to check
 * @returns {Boolean} if there is a lemon here.
 */
function boardIsLemon(point) {
	var isLemon = (this.lemon.place.x == point.x)
			&& (this.lemon.place.y == point.y);
	return isLemon;
}

/**
 * Spawns a new lemon!
 * 
 * @returns {LemonLemon} the lemon spawned.
 */
function boardSpawnLemon() {
	var x = Math.floor(Math.random() * width);
	var y = Math.floor(Math.random() * height);
	var point = new LemonPoint(x, y);
	var illegal = this.isWall(point) || this.eater.contains(point);
	while (illegal) {
		x = Math.floor(Math.random() * width);
		y = Math.floor(Math.random() * height);
		point = new LemonPoint(x, y);
		illegal = this.isWall(point) || this.eater.contains(point);
	}
	this.lemon = new LemonLemon(point);
	this.release(point);
	return this.lemon;
}

/**
 * Removes anything that was drawn on top of this point.
 * 
 * @param point
 *            The point to release.
 */
function boardRelease(point) {
	var classType = "";
	if (this.isWall(point)) {
		classType = "lemon-wall-" + this.walls[point.y][point.x];
	} else if (this.isLemon(point)) {
		classType = "lemon-lemon";
	}
	document.getElementById('lemon-cell-x' + point.x + '-y' + point.y).className = classType;
}

/**
 * A single tick of this board.
 */
function boardTick() {
	this.eater.tick();
	this.counter.tick();
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
var gameBoard;

/**
 * Initialize the game
 */
function lemonInit() {
	lemonDrawBoard();
	// TODO this is testing things:
	var b = "";
	for ( var y = 0; y < height; y++) {
		for ( var x = 0; x < width; x++) {
			if (x==5 && y==10) {
				b+= 'L';
			} else if (x == 60 || y==20) {
				b += ((x + y) % 7) + 1;
			} else {
				b += '0';
			}
		}
	}
	gameBoard = new LemonBoard(b, new LemonCounter(5));
	started = true;
	// TODO End testing things
	// Add listeners and focus.
	var gameArea = document.getElementById('lemon-focus-controller');
	gameArea.onkeydown = function(e) {
		if (started) {
			switch (e.keyCode) {
			case 65:
			case 37:
				// left
				gameBoard.setEaterDirection('w');
				break;
			case 87:
			case 38:
				// up
				gameBoard.setEaterDirection('n');
				break;
			case 68:
			case 39:
				// right
				gameBoard.setEaterDirection('e');
				break;
			case 83:
			case 40:
				// down
				gameBoard.setEaterDirection('s');
				break;
			}
		}
	};
	gameArea.onkeyup = function(e) {
		// unused i think
	};
	setInterval("lemonTick()", refreshRate);
	gameArea.focus();
}

/**
 * Sets size of board and redraws it.
 * 
 * @param w
 *            new width
 * @param h
 *            new height
 */
function setSize(w, h) {
	width = w;
	height = h;
	lemonDrawBoard();
}

/**
 * Draws our empty game board. Must be further initialized for every level
 */
function lemonDrawBoard() {
	// TODO Decide if it is wanted to add a layer to draw backgrounds on
	var b = "";
	for ( var y = 0; y < height; y++) {
		b += '<span id="lemon-line-' + y + '" class="lemon-background">';
		for ( var x = 0; x < width; x++) {
			b += '<span id="lemon-cell-x' + x + '-y' + y + '">' + empty
					+ '</span>';
		}
		b += "</span><br />";
	}
	b += '<input type="button" id="lemon-focus-controller" value="something to recieve keyboard commands" />';
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
	// TODO make nice little start animation that shows which buttons do what.
}

/**
 * If game is started, this should happen
 */
function lemonGameTick() {
	// TODO
	gameBoard.tick();
}