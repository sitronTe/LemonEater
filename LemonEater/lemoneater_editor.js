// HTML identifiers
var editorId = "lemon-eater-editor";
var packNameId = "lemon-pack-name";
var packWidthId = "lemon-pack-width";
var packHeightId = "lemon-pack-height";
var editAreaId = "lemon-editor-edit";
var editColorChooserId = "lemon-color-chooser";
var editColorSelectedId = "lemon-color-selected";
var editCellStrippedId = "lemon-edit-cell-";
var editEaterSelectId = "lemon-eater-select";
var editTargetCountId = "lemon-edit-target";
var lemonEaterHeadClass = "lemon-eater-head";
var lemonEaterBodyClass = "lemon-eater-body";
var lemonWallStrippedClass = "lemon-wall-";

// Other identifiers
var bgId = "background";
var fgId = "level";
var txtId = "text";
var introId = "intro";
var outroId = "outro";
var gameOverId = "game-over";

// To remember if we are currently choosing spawn point.
var editSpawnSelected = false;

// Parsed pack name
var parsedPackName = "";

// Text content of levels and cut-scenes
var editorIntroTxt = "";
var editorOutroTxt = "";
var editorGameOverTxt = "";
var editorLevelsTxt = "";

// The currently editing level
var editorEditingLevel = {
	"id" : "",
	"skippable" : true,
	"target" : 1,
	"textLayerSize" : {
		"x" : 0,
		"y" : 0
	},
	"textLayer" : [ [] ],
	"bgLayerSize" : {
		"x" : 0,
		"y" : 0
	},
	"bgLayer" : [ [] ],
	"bgSelected" : "",
	"fgLayer" : [],
	"fgSelected" : "",
	"eaterPos" : {
		"x" : 0,
		"y" : 0
	}
};

// Keeps track of how many levels are created
var idCounter = 0;

// Keeps track of dimensions to be used in current pack
var packDimensions = {
	"x" : 0,
	"y" : 0
};

// dictionaries
var translations = {
	" " : "&nbsp;",
	"<" : "&lt;",
	">" : "&gt;",
	"&" : "&amp;",
	'"' : "&quot;",
	"æ" : "&aelig;",
	"Æ" : "&Aelig;",
	"ø" : "&oslash;",
	"Ø" : "&Oslash;",
	"å" : "&aring;",
	"Å" : "&Aring;"
};
var bgTypes = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b",
		"c", "d", "e" ];
var wallTypes = [ "0", "1", "2", "3", "4", "5", "6", "7" ];

/**
 * Starts the editor
 */
function lemonEditorInit() {
	// resets editor:
	parsedPackName = "";
	editorIntroTxt = "";
	editorOutroTxt = "";
	editorGameOverTxt = "";
	editorLevelsTxt = "";
	editorEditingLevel = null;
	idCounter = 0;
	packDimensions = {
		"x" : 0,
		"y" : 0
	};
	// fills editor with new material:
	var newContent = "";
	newContent += 'name: <input type="text" id="' + packNameId + '" /><br />';
	newContent += "Only fixed sizes for levels currently available<br />";
	newContent += 'width: <input type="number" value="80" id="' + packWidthId
			+ '" /><br />';
	newContent += 'height: <input type="number" value="30" id="' + packHeightId
			+ '" /><br />';
	newContent += '<input type="button" value="Create new pack" onclick="editorCreateNewPack()" />';
	document.getElementById(editorId).innerHTML = newContent;
}

/**
 * Creates new level pack. Will not function until lemonEditorInit() is run.
 */
function editorCreateNewPack() {
	var e = document.getElementById(packNameId);
	parsedPackName = "<name>";
	// Testing correctness of input
	if (e == null) {
		alert("Could not find correct element. Very wrong!");
		return;
	}
	if (e.value == null || e.value == "") {
		alert("Please input name of new pack!");
		return;
	}
	parsedPackName += editorTranslateStringWithSpaces(e.value);
	parsedPackName += "</name>";
	e = document.getElementById(packWidthId).value * 1;
	if (e < 2) {
		alert("width must at least be 2 cells");
		return;
	}
	packDimensions.x = e;
	e = document.getElementById(packHeightId).value * 1;
	if (e < 2) {
		alert("height must at least be 2 cells");
		return;
	}
	packDimensions.y = e;
	editorShowMainPackScreen();
}

function editorShowMainPackScreen() {
	var newContent = "";
	if (editorIntroTxt == "")
		newContent += '<input type="button" value="Create intro" onclick="editorCreateIntro()" /><br />';
	else
		newContent += "Intro already created. Editing not supported<br />";
	if (editorOutroTxt == "")
		newContent += '<input type="button" value="Create outro" onclick="editorCreateOutro()" /><br />';
	else
		newContent += "Outro already created. Editing not supported<br />";
	if (editorGameOverTxt == "")
		newContent += '<input type="button" value="Create game over animation'
				+ '" onclick="editorCreateGameOver()" /><br />';
	else
		newContent += "Game over animation already created. Editing not supported<br />";
	newContent += '<input type="button" value="Create new level ('
			+ (idCounter + 1) + ')" onclick="editorCreateNewLevel()" /><br />';
	document.getElementById(editorId).innerHTML = newContent;
}

function editorShowMainLevelScreen() {
	if (editorEditingLevel == null) {
		alert("Cannot edit empty level");
		return;
	}
	var v = editorEditingLevel.target == null ? 1 : editorEditingLevel.target;
	var newContent = '<input type="number" value="' + v + '" id="'
			+ editTargetCountId + '" onchange="editorTargetChanged()" /><br />';
	newContent += '<input type="button" value="Edit text layer" '
			+ 'onclick="editorShowTextLayerEditor()" /><br />';
	newContent += '<input type="button" value="Edit background layer" '
			+ 'onclick="editorShowBGLayerEditor()" /><br />';
	newContent += '<input type="button" value="Edit level layer" '
			+ 'onclick="editorShowFGLayerEditor()" /><br />';
	newContent += "editing the level is strongly discouraged when editing intr"
			+ "o, outro, game over animation or other type of skippable level.";
	newContent += '<input type="button" value="Test this level!" '
			+ 'onclick="editorTestCurrentLevel()" /><br />';
	newContent += '<input type="button" value="FINISH! Cannot be undone" '
			+ 'onclick="editorFinalizeCurrentLevel()" />';
	// TODO Add skippable select
	// TODO Add target lemons
	document.getElementById(editorId).innerHTML = newContent;
}

function editorTargetChanged() {
	if (editorEditingLevel == null) {
		alert("Target should not change before level is created!");
		return;
	}
	var newVal = document.getElementById(editTargetCountId).value * 1;
	if (newVal < 1) {
		document.getElementById(editTargetCountId).value = 1;
	} else {
		editorEditingLevel.target = newVal;
	}
}

/**
 * Tests the current level being edited. Requires access to lemoneater.js and
 * ExternalObjects.js to function properly.
 */
function editorTestCurrentLevel() {
	var translatedLvl = editorTranslateEditingLevelToString(editorEditingLevel);
	if (translatedLvl == null)
		return;
	var outStr = '<?xml version="1.0" encoding="UTF-8"?>';
	outStr += '<lemon:lemon-eater xmlns:lemon="lemon-schema/" '
			+ 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
			+ 'xsi:schemaLocation="lemon-schema/ lemon-schema.xsd ">';
	outStr += "<name>Testing</name>";
	outStr += translatedLvl;
	outStr += "</lemon:lemon-eater>";
	// This requires lemoneater.js and ExternalObjects.js to function
	extPack = lemonParsePackFromString(outStr);
	lemonInit();
}

function editorFinalizeCurrentLevel() {
	// TODO
}

function editorShowTextLayerEditor() {
	// TODO
}

function editorShowBGLayerEditor() {
	// TODO
}

function editorTranslateArrayToContentString(array, skipSign, xtraData) {
	var output = "<content>";
	for ( var y = 0; y < array.length; y++) {
		for ( var x = 0; x < array[y].length; x++) {
			if (array[y][x] != skipSign)
				output += '<c x="' + x + '" y="' + y + '">' + array[y][x]
						+ '</c>';
		}
	}
	if (xtraData != null)
		output += xtraData;
	output += "</content>";
	return output;
}

function editorBuildDescriptionString(type, width, height, locX, locY, speedX,
		speedY, wrap, pauseStart, pauseEnd, target) {
	if (type != txtId && type != bgId && type != fgId)
		alert("Description type is faulty. String attempted built anyway");
	if (width < 0 || height < 0)
		alert("Description width or height is faulty. String attempted built anyway");
	if (pauseEnd < 0 || pauseStart < 0)
		alert("Description pause data is faulty. String attempted built anyway");
	if (target < 1)
		alert("Description target is faulty. String attempted built anyway");
	var output = "<description><type>" + type + "</type>";
	output += "<dimension><width>" + width + "</width><height>" + height
			+ "</height></dimension>";
	output += "<location><x>" + locX + "</x><y>" + locY + "</y></location>";
	output += "<move><speed><x>" + speedX + "</x><y>" + speedY + "</y></speed>";
	output += "<wrap>" + wrap + "</wrap>";
	output += "<pause><start>" + pauseStart + "</start><end>" + pauseEnd
			+ "</end></pause></move>";
	output += "<target>" + target + "</target>";
	output += "</description>";
	return output;
}

function editorTranslateEditingLevelToString(editingLevel) {
	if (editingLevel.bgLayer == null && editingLevel.textLayer == null
			&& editingLevel.fgLayer == null) {
		alert("No layers in level found! Could not build string");
		return null;
	}
	var output = "<data>";
	output += "<id>" + editingLevel.id + "</id>";
	output += "<dimension><width>" + packDimensions.x + "</width><height>"
			+ packDimensions.y + "</height></dimension>";
	output += "<skippable>" + editingLevel.skippable + "</skippable>";
	if (editingLevel.textLayer != null)
		output += editorTranslateTxtLayerToString(editingLevel);
	if (editingLevel.bgLayer != null)
		output += editorTranslateBGToString(editingLevel);
	if (editingLevel.fgLayer != null)
		output += editorTranslateFGToString(editingLevel);
	output += "</data>";
	return output;
}

function editorTranslateFGToString(editingLevel) {
	if (editingLevel.fgLayer[editingLevel.eaterPos.y][editingLevel.eaterPos.x] != "0") {
		editingLevel.fgLayer[editingLevel.eaterPos.y][editingLevel.eaterPos.x] = "0";
		alert("Fault in foreground detected! Wall at spawn point removed");
	}
	var output = "<layer>";
	var eaterCell = '<c x="' + editingLevel.eaterPos.x + '" y="'
			+ editingLevel.eaterPos.y + '">L</c>';
	output += editorBuildDescriptionString(fgId, packDimensions.x,
			packDimensions.y, 0, 0, 0, 0, false, 0, 0, editingLevel.target);
	output += editorTranslateArrayToContentString(editingLevel.fgLayer, "0",
			eaterCell);
	output += "</layer>";
	return output;
}

function editorTranslateBGToString(editingLevel) {
	// TODO
	return "";
}

function editorTranslateTxtLayerToString(editingLevel) {
	// TODO
	return "";
}

function editorShowFGLayerEditor() {
	if (editorEditingLevel == null) {
		alert("Misplaced show foreground argument");
		return;
	}
	// init
	if (editorEditingLevel.fgLayer == null) {
		editorEditingLevel.fgLayer = new Array();
		for ( var y = 0; y < packDimensions.y; y++) {
			editorEditingLevel.fgLayer[y] = new Array();
			for ( var x = 0; x < packDimensions.x; x++) {
				editorEditingLevel.fgLayer[y][x] = "0";
			}
		}
		editorEditingLevel.eaterPos = new Object();
		editorEditingLevel.eaterPos.x = 0;
		editorEditingLevel.eaterPos.y = 0;
	}
	// draw
	var newContent = "";
	newContent += '<div id="' + editAreaId + '">';
	for ( var y = 0; y < packDimensions.y; y++) {
		newContent += '<span class="lemon-background">';
		for ( var x = 0; x < packDimensions.x; x++) {
			var classType = "";
			var t = editorEditingLevel.fgLayer[y][x];
			if (t != "0")
				classType = ' class="' + lemonWallStrippedClass + t + '"';
			newContent += '<span id="' + editCellStrippedId + 'x' + x + 'y' + y
					+ '"' + classType + '" onclick="editorEditCellClicked(' + x
					+ ',' + y + ",'" + fgId + '\')">';
			newContent += translations[" "] + '</span>';
		}
		newContent += '</span><br />';
	}
	newContent += '</div><br />';
	newContent += '<div id="' + editColorChooserId + '">';
	for ( var type in wallTypes) {
		var classType = type == "0" ? "" : 'class="' + lemonWallStrippedClass
				+ type + '"';
		newContent += '<span ' + classType
				+ ' onclick="editorColorChooserCellClicked(\'' + type + '\',\''
				+ fgId + '\')">' + translations[" "] + translations[" "]
				+ '</span>';
	}
	newContent += '<br /><span id="' + editEaterSelectId
			+ '" onclick="editorSpawnPointSelectClicked()">';
	newContent += '<span class="' + lemonEaterHeadClass + '">'
			+ translations[" "] + '</span>';
	newContent += '<span class="' + lemonEaterBodyClass + '">'
			+ translations[" "] + translations[" "] + translations[" "]
			+ translations[" "] + '</span>';
	newContent += '</span>';
	var chosenClass = "";
	if (editorEditingLevel.fgSelected != null
			|| editorEditingLevel.fgSelected != "0")
		chosenClass = ' class="' + lemonWallStrippedClass
				+ editorEditingLevel.fgSelected + '"';
	newContent += '<br /><span id="' + editColorSelectedId + '"' + chosenClass
			+ '>' + translations[" "] + translations[" "] + '</span>';
	newContent += '</div><br />';
	newContent += '<div><input type="button" value="Back to level select" '
			+ 'onclick="editorShowMainLevelScreen()" /></div>';
	document.getElementById(editorId).innerHTML = newContent;
	// Show spawn point
	document.getElementById(editCellStrippedId + 'x'
			+ editorEditingLevel.eaterPos.x + 'y'
			+ editorEditingLevel.eaterPos.y).className = lemonEaterHeadClass;
}

function editorUpdateColorChosen(layer) {
	var cName = "";
	if (layer == fgId) {
		cName = editSpawnSelected ? lemonEaterHeadClass
				: lemonWallStrippedClass + editorEditingLevel.fgSelected;
	} else if (layer == bgId) {
		// TODO
	} else
		return;
	document.getElementById(editColorSelectedId).className = cName;
}

function editorUpdatePoint(x, y, layer) {
	var cName = "";
	if (layer == fgId) {
		var spawnLoc = editorEditingLevel.eaterPos;
		if (spawnLoc.x == x * 1 && spawnLoc.y == y * 1)
			cName = lemonEaterHeadClass;
		else
			cName = lemonWallStrippedClass
					+ editorEditingLevel.fgLayer[y * 1][x * 1];
	} else {
		// TODO
		return;
	}
	document.getElementById(editCellStrippedId + "x" + x + "y" + y).className = cName;
}

function editorSpawnPointSelectClicked() {
	editSpawnSelected = true;
	editorUpdateColorChosen(fgId);
}

function editorEditCellClicked(x, y, layer) {
	x = x * 1;
	y = y * 1;
	if (layer == fgId) {
		if (editSpawnSelected) {
			var oldX = editorEditingLevel.eaterPos.x;
			var oldY = editorEditingLevel.eaterPos.y;
			editorEditingLevel.eaterPos.x = x;
			editorEditingLevel.eaterPos.y = y;
			editorEditingLevel.fgLayer[y][x] = "0";
			editSpawnSelected = false;
			// Updating graphics
			editorUpdatePoint(oldX, oldY, layer);
			editorUpdateColorChosen(layer);
		} else {
			if (editorEditingLevel.eaterPos.x == x
					&& editorEditingLevel.eaterPos.y == y)
				return;
			editorEditingLevel.fgLayer[y][x] = editorEditingLevel.fgSelected;
		}
	} else if (layer == bgId) {
		editorEditingLevel.bgLayer[y][x] = editorEditingLevel.bgSelected;
	} else
		return;
	editorUpdatePoint(x, y, layer);
}

function editorColorChooserCellClicked(colorId, layer) {
	if (layer == fgId) {
		editorEditingLevel.fgSelected = colorId;
	} else if (layer == bgId) {
		editorEditingLevel.bgSelected = colorId;
		// TODO
	}
	editSpawnSelected = false;
	editorUpdateColorChosen(layer);
}

function editorCreateIntro() {
	createNewEditingLevel(introId, true);
}

function editorCreateOutro() {
	createNewEditingLevel(outroId, true);
}

function editorCreateGameOver() {
	createNewEditingLevel(gameOverId, true);
}

function editorCreateNewLevel() {
	idCounter++;
	createNewEditingLevel("" + idCounter, false);
}

function createNewEditingLevel(id, skippable) {
	editorEditingLevel = new Object();
	editorEditingLevel.id = id;
	editorEditingLevel.skippable = skippable;
	editorShowMainLevelScreen();
}

function editorTranslateStringWithSpaces(oldString) {
	var newStr = "";
	for ( var i = 0; i < oldString.length; i++) {
		var c = oldString.charAt(i);
		if (translations[c] == null)
			newStr += c;
		else
			newStr += translations[c];
	}
	return newStr;
}
