/*
 * Objects area -
 * 	LemonCounter -> Keeps track of points and lives.
 * 	LemonPoint -> a 2 dimensional point.
 * 	LemonLemon -> a lemon to eat! Yummi!
 * 	LemonEater -> an eater of lemons.
 * 	LemonBoard -> a place to move around. Loaded with lemons!
 *  LemonMoveableLayer -> a layer that may or may not move across screen
 */

// TODO When clearing a level by eating lemons, the LemonEater still shows on next screen.
// TODO Discover why
function LemonLevelPack() {
	this.setEaterDirection = packSetEaterDirection;
	this.counter = null;
	this.name = null;
	this.gameBoard = null;
	this.textLayer = null;
	this.background = null;
	this.introAnimation = null;
	this.outroAnimation = null;
	this.gameOverAnimation = null;
	this.urlLocations = null;
	this.scoreboard = null;
	this.sortedExternalDatas = null;
	this.skippable = false;
	this.nextLevel = -1;
	this.setLayers = packSetLayers;
	this.tick = packTick;
	// should bring next level
	this.next = packNext;
	// Should set external level pack.
	this.setExternalLevelPack = packSetExternalLevelPack;
	// Should cause the game over sequence to be played
	this.gameOver = packGameOver;
	// Should try to jump over this level (if level is skippable).
	this.skip = packSkip;
}

function packSetEaterDirection(direction) {
	if (this.gameBoard != null)
		this.gameBoard.setEaterDirection(direction);
}

function packSetLayers(externalData) {
	if (externalData == null) {
		this.gameBoard = null;
		this.textLayer = null;
		this.background = null;
		lemonClearBoard();
	} else {
		if (this.counter == null)
			this.counter = new LemonCounter(5);
		this.skippable = externalData.skippable;
		this.gameBoard = null;
		lemonClearFG();
		if (externalData.lvlLayer != null) {
			this.gameBoard = new LemonBoard(externalData.lvlLayer, this.counter);
		}
		this.textLayer = null;
		lemonClearText();
		if (externalData.txtLayer != null)
			this.textLayer = new LemonMovableLayer(externalData.txtLayer);
		this.background = null;
		lemonClearBG();
		if (externalData.bgLayer != null)
			this.background = new LemonMovableLayer(externalData.bgLayer);
	}
}

function packSetExternalLevelPack(externalPack) {
	this.gameBoard = null;
	this.textLayer = null;
	this.background = null;
	this.introAnimation = null;
	this.outroAnimation = null;
	this.gameOverAnimation = null;
	this.skippable = false;
	this.name = externalPack.name;
	this.urlLocations = externalPack.urlLocations;
	this.scoreboard = externalPack.scoreboard;
	this.nextLevel = -1;
	// Find intro, outro, game over and sort the rest
	this.sortedExternalDatas = new Array();
	var extData = externalPack.levelDatas;
	for ( var i = 0; i < extData.length; i++) {
		if (extData[i].idType == "intro") {
			this.introAnimation = extData[i];
		} else if (extData[i].idType == "outro") {
			this.outroAnimation = extData[i];
		} else if (extData[i].idType == "game-over") {
			this.gameOverAnimation = extData[i];
		} else {
			// Sorting algorithm, insertion sort. Do not expect large, unsorted
			// data sets.
			var j = this.sortedExternalDatas.length;
			var idt = extData[i].idType * 1;
			while (j > 0 && (this.sortedExternalDatas[j - 1].idType * 1) > idt) {
				this.sortedExternalDatas[j] = this.sortedExternalDatas[j - 1];
				j--;
			}
			this.sortedExternalDatas[j] = extData[i];
		}
	}
	// Starts next level. Or intro. Bases itself in that there are content of
	// data.
	this.next();
}

function packNext() {
	// Checks if game pack has been set yet.
	if (this.sortedExternalDatas == null)
		return;
	if (this.nextLevel == -1) {
		this.nextLevel++;
		if (this.introAnimation == null) {
			this.next();
			return;
		} else {
			this.setLayers(this.introAnimation);
		}
	} else if (this.nextLevel == -2) {
		this.nextLevel++;
		if (this.gameOverAnimation == null) {
			this.next();
			return;
		} else {
			this.setLayers(this.gameOverAnimation);
		}
	} else if (this.nextLevel >= this.sortedExternalDatas.length) {
		this.nextLevel = -1;
		this.gameOver();
		if (this.outroAnimation == null) {
			this.next();
			return;
		} else {
			this.setLayers(this.outroAnimation);
		}
	} else {
		this.setLayers(this.sortedExternalDatas[this.nextLevel]);
		this.nextLevel++;
		if (this.counter != null) {
			this.counter.printLives();
			this.counter.printPoints();
			this.counter.printEatenLemons();
		}
	}
}

function packGameOver() {
	// TODO Submit score.
	if (this.counter != null) {
		this.counter.isShown = false;
		this.counter = null;
	}
	// Clears board completely
	lemonClearBoard();
	if (this.nextLevel >= 0) {
		this.nextLevel = -2;
		this.next();
	}
}

function packSkip() {
	if (this.skippable)
		this.next();
}

function packTick() {
	// TODO Find bug where eaters do not disappear when target is met.
	if (this.gameBoard != null)
		this.gameBoard.tick();
	else
		// TODO This is an exceptionally stupid bugfix
		lemonClearFG();
	if (this.textLayer != null)
		this.textLayer.tick();
	if (this.background != null)
		this.background.tick();
}

/**
 * Creates a new <code>LemonMoveableLayer</code> from the
 * <code>LemonExternalTextOrBackgroundLayer</code> brought along.
 */
function LemonMovableLayer(externalLayer) {
	this.repaint = movableRepaint;
	this.type;
	this.dimension;
	this.velocity;
	this.wrap;
	this.pauseBeforeStart;
	this.pauseAfterEnd;
	this.moveables;
	this.startPauseLeft;
	this.endPauseLeft;
	this.location;
	this.mooving;
	this.moveNow;
	this.tick = lemonMoveTick;
	this.setLayer = setNewLayer;
	this.setLayer(externalLayer);
}

function movableRepaint() {
	for ( var x = 0; x < width; x++) {
		for ( var y = 0; y < height; y++) {
			var point = new LemonPoint(x, y);
			if (this.type == "text")
				lemonUpdateText(point, empty);
			else if (this.type == "background")
				lemonUpdateBackground(point, empty);
		}
	}
	for ( var i = 0; i < this.moveables.length; i++) {
		var mv = this.moveables[i];
		// if too far left
		if (mv.location.x < 0 || mv.location.x < this.location.x)
			return;
		// if too far right
		if (mv.location.x > width
				|| mv.location.x > this.dimension.x + this.location.x)
			return;
		// if too high
		if (mv.location.y < 0 || mv.location.y < this.location.y)
			return;
		// if too low
		if (mv.location.y > height
				|| mv.location.y > this.dimension.y + this.location.y)
			return;
		if (this.type == "text")
			lemonUpdateText(mv.location, mv.content);
		else if (this.type == "background")
			lemonUpdateBackground(mv.location, mv.content);
	}
}

function setNewLayer(externalLayer) {
	this.type = externalLayer.type;
	// dimension is used for wrapping
	var dim = externalLayer.dimension;
	this.dimension = new LemonPoint(Math.abs(dim.x), Math.abs(dim.y));
	// location is only defined as start location
	var loc = externalLayer.location;
	this.velocity = externalLayer.velocity;
	this.wrap = externalLayer.wrap;
	this.pauseBeforeStart = externalLayer.pauseBeforeStart;
	this.pauseAfterEnd = externalLayer.pauseAfterEnd;
	var moves = externalLayer.moveables;
	this.moveables = new Array();
	// update moveables start location
	for ( var i = 0; i < moves.length; i++) {
		this.moveables[i] = new LemonMoveableElement(moves[i].location.x
				+ loc.x, moves[i].location.y + loc.y, moves[i].content);
	}
	// Set up counters for later use
	this.startPauseLeft = this.pauseBeforeStart;
	this.endPauseLeft = this.pauseAfterEnd;
	// This objects location is used to keep track of position relative to
	// dimension
	this.location = new LemonPoint(0, 0);
	// Keeps track of where in the movement cycle we are
	this.mooving = this.startPauseLeft <= 0;
	// Move now is a vector to keep track of how many clicks one should move
	// each tick.
	this.moveNow = new LemonPoint(0, 0);
	this.repaint();
}

/**
 * Calculates how much you should move in the direction given by the number.
 * 
 * @param number
 *            speed in the direction you wish to find movement.
 * @returns {Number} how much you should move in that direction.
 */
function lemonCalculateMoveRatio(number) {
	if (number < 0) {
		return Math.ceil(number / 100);
	} else {
		return Math.floor(number / 100);
	}
}

/**
 * How a <code>LemonMoveableLayer</code> ticks.
 */
function lemonMoveTick() {
	// If this layer is currently moving, make every moveable move and maybe
	// wrap.
	if (this.mooving) {
		// TODO find bug when we move faster than 100, why we may get changes in
		// stop place
		this.moveNow.x += this.velocity.x;
		this.moveNow.y += this.velocity.y;
		var moveX = lemonCalculateMoveRatio(this.moveNow.x);
		var moveY = lemonCalculateMoveRatio(this.moveNow.y);
		if (moveX == 0 && moveY == 0) {
			return;
		}
		this.moveNow.x -= 100 * moveX;
		this.moveNow.y -= 100 * moveY;
		var velNow = new LemonPoint(moveX, moveY);
		var emptyMap = new Object();
		var signMap = new Object();
		for ( var i = 0; i < this.moveables.length; i++) {
			this.moveables[i].move(velNow, this.wrap, this.dimension, emptyMap,
					signMap);
		}
		this.location.x += Math.abs(moveX);
		this.location.y += Math.abs(moveY);
		// If moved a cycle horizontal, see if we should stop.
		if (this.location.x >= this.dimension.x) {
			this.mooving = this.endPauseLeft <= 0 && this.startPauseLeft <= 0;
			this.location.x = 0;
		}
		// If moved a cycle vertical, see if we should stop.
		if (this.location.y >= this.dimension.y) {
			this.mooving = this.endPauseLeft <= 0 && this.startPauseLeft <= 0;
			this.location.y = 0;
		}
		// Refresh text elements of board
		for (k in signMap) {
			var point = lemonKeyDescifer(k);
			if (this.type == "text")
				lemonUpdateText(point, signMap[k]);
			else if (this.type == "background")
				lemonUpdateBackground(point, signMap[k]);
		}
		for (k in emptyMap) {
			if (emptyMap[k] != null) {
				var point = lemonKeyDescifer(k);
				if (this.type == "text")
					lemonUpdateText(point, emptyMap[k]);
				else if (this.type == "background")
					lemonUpdateBackground(point, emptyMap[k]);
			}
		}
		// If pause before start is over, start moving again
	} else if (this.startPauseLeft > 0) {
		this.startPauseLeft--;
		if (this.startPauseLeft <= 0) {
			this.mooving = true;
			this.startPauseLeft = this.pauseBeforeStart;
		}
		// If pause after end is over, see if we should start moving
	} else if (this.endPauseLeft > 0) {
		this.endPauseLeft--;
		if (this.endPauseLeft <= 0) {
			this.mooving = this.startPauseLeft <= 0;
			this.endPauseLeft = this.pauseAfterEnd;
		}
	}
}

function lemonUpdateText(pos, cont) {
	document.getElementById('lemon-cell-x' + pos.x + '-y' + pos.y).innerHTML = cont;
}

function lemonUpdateBackground(pos, cont) {
	if (cont == empty)
		document.getElementById('lemon-bgcell-x' + pos.x + '-y' + pos.y).className = "";
	else
		document.getElementById('lemon-bgcell-x' + pos.x + '-y' + pos.y).className = "lemon-bg-"
				+ cont;
}

/**
 * Creates a <code>LemonMoveableElement</code>. The element has a location,
 * content and possibility to move.
 * 
 * @param x
 *            the x localization of this element
 * @param y
 *            the y localization of this element
 * @param content
 *            the content of this element
 */
function LemonMoveableElement(x, y, content) {
	this.location = new LemonPoint(x, y);
	this.content = content;
	this.move = lemonMoveMove;
}

/**
 * moves the text element in the direction brought along.
 * 
 * @param direction
 *            the direction to move
 * @param wrap
 *            boolean to say if movement should wrap
 * @param wrapDimension
 *            if wrapping, how far back text should move
 * @param emptyMap
 *            map of cells to be cleared. Key calculation done by
 *            <code>lemonKeyCalculate</code>
 * @param signMap
 *            map of cells to be overwritten. Key calculation done by
 *            <code>lemonKeyCalculate</code>
 */
function lemonMoveMove(direction, wrap, wrapDimension, emptyMap, signMap) {
	if (direction.x == 0 && direction.y == 0) {
		return;
	}
	if ((this.location.x >= 0 && this.location.x < width)
			&& (this.location.y >= 0 && this.location.y < height)) {
		var place = lemonKeyCalculate(this.location);
		if (signMap[place] == null) {
			emptyMap[place] = empty;
		}
	}
	this.location.x += direction.x;
	this.location.y += direction.y;
	if (wrap) {
		if (direction.x < 0) {
			if (this.location.x < 0) {
				this.location.x += wrapDimension.x;
			}
		} else if (direction.x > 0) {
			if (this.location.x > wrapDimension.x) {
				this.location.x -= wrapDimension.x;
			}
		}
		if (direction.y < 0) {
			if (this.location.y < 0) {
				this.location.y += wrapDimension.y;
			}
		} else if (direction.y > 0) {
			if (this.location.y > wrapDimension.y) {
				this.location.y -= wrapDimension.y;
			}
		}
	}
	if ((this.location.x >= 0 && this.location.x < width)
			&& (this.location.y >= 0 && this.location.y < height)) {
		var place = lemonKeyCalculate(this.location);
		if (emptyMap[place] != null) {
			emptyMap[place] = null;
		}
		signMap[place] = this.content;
	}
}

/**
 * Calculates a hash key for <code>LemonPoints</code>. Dependent of global
 * width.
 * 
 * @param lemonPoint
 *            the point to calculate key for
 * @returns the key calculated
 */
function lemonKeyCalculate(lemonPoint) {
	return lemonPoint.y * width + lemonPoint.x;
}

/**
 * Calculates which point this key was constructed for. Dependent of global
 * width.
 * 
 * @param key
 *            the key to reconstruct
 * @returns {LemonPoint} the point the key represents
 */
function lemonKeyDescifer(key) {
	var tmpX = key % width;
	var tmpY = (key - tmpX) / width;
	return new LemonPoint(tmpX, tmpY);
}

/**
 * Creates a new counter for this game.
 * 
 * @param lives
 *            how many lives you are supposed to have.
 */
function LemonCounter(lives) {
	this.isShown = true;
	this.target = 1000000;
	this.setTarget = counterSetTarget;
	this.points = 0;
	this.lemonsEaten = 0;
	this.totalLemonsEaten = 0;
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
 * Sets a new target count for <code>LemonCounter</code>.
 * 
 * @param the
 *            new target
 */
function counterSetTarget(target) {
	this.target = target * 1;
	if (this.target < 0)
		alert("Malformed target number");
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
		// TODO If ever cleaning up, move rule check to container object.
		this.lives = 0;
		gamePack.gameOver();
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
	this.totalLemonsEaten++;
	this.points += 100;
	this.points += 10 * this.lemonsEaten;
	this.printPoints();
	this.printEatenLemons();
	if (this.target == this.lemonsEaten) {
		this.lemonsEaten = 0;
		gamePack.next();
	}
}

function counterOutLives() {
	if (!this.isShown)
		return;
	var l = this.lives;
	document.getElementById('lemon-cell-x1-y1').innerHTML = l % 10;
	l = Math.floor(l / 10);
	document.getElementById('lemon-cell-x0-y1').innerHTML = l % 10;
}

function counterOutPoints() {
	if (!this.isShown)
		return;
	var p = this.points;
	for ( var i = 5; i >= 0; i--) {
		document.getElementById('lemon-cell-x' + i + '-y0').innerHTML = p % 10;
		p = Math.floor(p / 10);
	}
}

function counterOutLemonsEaten() {
	if (!this.isShown)
		return;
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
 * Checks if a point is in this eater. The check is done in this eaters context.
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
 * Draws eater death to this position. Position is in eaters context, but is
 * drawn in absolute context.
 * 
 * @param point
 *            where the dead element is drawn
 */
function eaterDrawDeath(point) {
	document.getElementById('lemon-cell-x'
			+ (point.x + this.ownerBoard.location.x) + '-y'
			+ (point.y + this.ownerBoard.location.y)).className = 'lemon-eater-death';
}

/**
 * Draws eater head to this position. Position is in eaters context, but is
 * drawn in absolute context.
 * 
 * @param point
 *            where the head is drawn
 */
function eaterDrawHead(point) {
	document.getElementById('lemon-cell-x'
			+ (point.x + this.ownerBoard.location.x) + '-y'
			+ (point.y + this.ownerBoard.location.y)).className = 'lemon-eater-head';
}

/**
 * Draws eater body to this position. Position is in eaters context, but is
 * drawn in absolute context.
 * 
 * @param point
 *            where the body is drawn
 */
function eaterDrawBody(point) {
	document.getElementById('lemon-cell-x'
			+ (point.x + this.ownerBoard.location.x) + '-y'
			+ (point.y + this.ownerBoard.location.y)).className = 'lemon-eater-body';
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
		this.x = this.ownerBoard.dimension.x - 1;
	if (this.x >= this.ownerBoard.dimension.x)
		this.x = 0;
	this.y += this.dy;
	if (this.y < 0)
		this.y = this.ownerBoard.dimension.y - 1;
	if (this.y >= this.ownerBoard.dimension.y)
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
 * Creates a new <code>LemonBoard</code> based on the
 * <code>LemonExternalBoard</code> given. Will not spawn lemons or LemonEater
 * until start pause is over. Will draw walls immediately.
 * 
 * 
 * @param externalBoard
 *            the <code>LemonExternalBoars</code> to build this board from.
 * @param counter
 *            the <code>LemonCounter</code> that now counts time.
 */
function LemonBoard(externalBoard, counter) {
	// and width.
	this.setLemonExternalBoard = lemonSetExternalBoard;
	// Dimension of board. The coordinate system of the board
	this.dimension;
	// Location of board. Only used for rendering purposes.
	this.location;
	this.pauseBeforeStart;
	this.pauseAfterEnd;
	// Counter is the only thing that should not change when new level are set.
	this.counter = counter;
	this.lemon;
	this.updateWall = lemonBoardUpdateWall;
	this.walls;
	this.start;
	this.eater = null;
	this.isWall = boardWall;
	this.isLemon = boardIsLemon;
	this.tick = boardTick;
	this.spawnLemon = boardSpawnLemon;
	this.release = boardRelease;
	this.consumeLemon = boardConsume;
	this.setEaterDirection = boardEaterDirection;
	this.killEater = boardKillEater;
	this.spawnEater = boardSpawnEater;
	this.setLemonExternalBoard(externalBoard);
}

function lemonSetExternalBoard(externalBoard) {
	// TODO Ensure we can not alter anything in the external board.
	this.lemon = new LemonLemon(new LemonPoint(-1, -1));
	this.walls = externalBoard.board;
	this.start = externalBoard.lemonSpawn;
	this.dimension = externalBoard.dimension;
	this.counter.setTarget(externalBoard.target);
	this.location = externalBoard.location;
	if (this.location.x < 0 || this.location.y < 0)
		alert("Did set a board with malformed location");
	if (this.dimension.x < 0 || this.dimension.y < 0)
		alert("Did set a board with malformed dimension");
	if (this.dimension.x + this.location.x > width
			|| this.dimension.y + this.location.y > height)
		alert("Did set a board with wrong dimension and location");
	this.pauseBeforeStart = externalBoard.pauseBeforeStart;
	this.pauseAfterEnd = externalBoard.pauseAfterEnd;
	for ( var y = 0; y < this.dimension.y; y++) {
		for ( var x = 0; x < this.dimension.x; x++) {
			this.updateWall(x, y);
		}
	}
	if (this.pauseBeforeStart <= 0) {
		this.eater = new LemonEater(this.start, 1, 'e', this);
		this.spawnLemon();
	}
}

/**
 * Sets a wall segment and updates graphics.
 * 
 * @param x
 *            x-position in boards coordinate system
 * @param y
 *            y-position in boards coordinate system
 */
function lemonBoardUpdateWall(x, y) {
	var relX = x + this.location.x;
	var relY = y + this.location.y;
	if (this.walls[y][x] > 0)
		document.getElementById('lemon-cell-x' + relX + '-y' + relY).className = 'lemon-wall-'
				+ this.walls[y][x];
	else
		document.getElementById('lemon-cell-x' + relX + '-y' + relY).className = '';
}

/**
 * Spawns a LemonEater at start location, and notifies counter to count down
 * lives.
 */
function boardKillEater() {
	this.spawnEater();
	this.counter.eaterDied();
}

/**
 * Spawns a LemonEater at start location.
 */
function boardSpawnEater() {
	this.eater = new LemonEater(this.start, 1, 'e', this);
}

/**
 * Sets this boards eaters direction.
 */
function boardEaterDirection(direction) {
	if (this.eater != null)
		this.eater.setDirection(direction);
}

/**
 * Checks if the point of interest is a wall.
 * 
 * @param point
 *            point to check in boards coordinate system
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
 *            point to check in boards coordinate system
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
	var x = Math.floor(Math.random() * this.dimension.x);
	var y = Math.floor(Math.random() * this.dimension.y);
	var point = new LemonPoint(x, y);
	var illegal = this.isWall(point) || this.eater.contains(point);
	while (illegal) {
		x = Math.floor(Math.random() * this.dimension.x);
		y = Math.floor(Math.random() * this.dimension.y);
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
	document.getElementById('lemon-cell-x' + (point.x + this.location.x) + '-y'
			+ (point.y + this.location.y)).className = classType;
}

/**
 * A single tick of this board.
 */
function boardTick() {
	if (this.pauseBeforeStart > 0) {
		this.pauseBeforeStart--;
		if (this.pauseBeforeStart == 0) {
			this.eater = new LemonEater(this.start, 1, 'e', this);
			this.spawnLemon();
		}
	} else {
		this.eater.tick();
		this.counter.tick();
	}
}

/*
 * The game lemon eater follows.
 */

var width = 80;
var height = 30;
var intro;
// Empty is a simplification of a space that shows on screen.
var empty = "&nbsp;";
// RefreshRate is how often(ish) (in milliseconds) the level will be updated
var refreshRate = 100;
var testCellX = width - 1;
var testCellY = height - 1;

var gamePack;

/**
 * Initialize the game
 */
function lemonInit() {
	// intro = new LemonMovableTextLayer(extIntro);
	lemonInitGameArea();
	// TODO this is testing things:
	gamePack = new LemonLevelPack();
	gamePack.setExternalLevelPack(extPack);
	// TODO End testing things
	// TODO Add listener for level pack change
	// Adds listeners and focus.
	var gameArea = document.getElementById('lemon-focus-controller');
	gameArea.onkeydown = function(e) {
		switch (e.keyCode) {
		case 65:
		case 37:
			// left
			gamePack.setEaterDirection('w');
			break;
		case 87:
		case 38:
			// up
			gamePack.setEaterDirection('n');
			break;
		case 68:
		case 39:
			// right
			gamePack.setEaterDirection('e');
			break;
		case 83:
		case 40:
			// down
			gamePack.setEaterDirection('s');
			break;
		case 13:
		case 32:
			gamePack.skip();
			break;
		}
	};
	gameArea.onblur = function() {
		gameArea.focus();
	};
	gameArea.onkeyup = function(e) {
		// unused
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
 * Initializes the game area, with focus controller and game area. Height and
 * width must be set before this is called.
 */
function lemonInitGameArea() {
	var mainString = '<span id="lemon-game-area"></span>';
	mainString += '<input type="button" id="lemon-focus-controller" '
			+ 'value="something to recieve keyboard commands" />';
	// TODO REMOVE: (stands until game is completed, still need for debug)
	mainString += '<div id="debug-out"><div>';
	// TODO REMOVE END

	document.getElementById("lemonEater").innerHTML = mainString;
	lemonDrawBoard();
}

/**
 * Draws our empty game board. Must be further initialized for every level
 */
function lemonDrawBoard() {
	var b = "";
	for ( var y = 0; y < height; y++) {
		b += '<span id="lemon-line-' + y + '" class="lemon-background">';
		for ( var x = 0; x < width; x++) {
			b += '<span id = "lemon-bgcell-x' + x + '-y' + y
					+ '"><span id="lemon-cell-x' + x + '-y' + y + '">' + empty
					+ '</span></span>';
		}
		b += "</span><br />";
	}
	b += '</span>';
	document.getElementById("lemon-game-area").innerHTML = b;
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
			document.getElementById('lemon-bgcell-x' + x + '-y' + y).className = "";
		}
	}
}

/**
 * Clears background layer only.
 */
function lemonClearBG() {
	for ( var y = 0; y < height; y++) {
		for ( var x = 0; x < width; x++) {
			document.getElementById('lemon-bgcell-x' + x + '-y' + y).className = "";
		}
	}
}

/**
 * Clears text layer only
 */
function lemonClearText() {
	for ( var y = 0; y < height; y++) {
		for ( var x = 0; x < width; x++) {
			document.getElementById('lemon-cell-x' + x + '-y' + y).innerHTML = empty;
		}
	}
}

/**
 * Clears foreground, or layer containing walls, lemons and eaters.
 */
function lemonClearFG() {
	for ( var y = 0; y < height; y++) {
		for ( var x = 0; x < width; x++) {
			document.getElementById('lemon-cell-x' + x + '-y' + y).className = "";
		}
	}
}

/**
 * What happens when timer ticks.
 */
function lemonTick() {
	if (gamePack != null)
		gamePack.tick();
}