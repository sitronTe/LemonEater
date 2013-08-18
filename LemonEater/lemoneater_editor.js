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
var editSkipSelectId = "lemon-skip-select";
var editSizeXId = "lemon-edit-size-x";
var editSizeYId = "lemon-edit-size-y";
var editSpeedXId = "lemon-edit-speed-x";
var editSpeedYId = "lemon-edit-speed-y";
var editLocationXId = "lemon-edit-loc-x";
var editLocationYId = "lemon-edit-loc-y";
var editPauseStartId = "lemon-edit-pause-start";
var editPauseEndId = "lemon-edit-pause-end";
var editWrapId = "lemon-edit-wrap";
var editTextAreaId = "lemon-edit-text";
var lemonEaterHeadClass = "lemon-eater-head";
var lemonEaterBodyClass = "lemon-eater-body";
var lemonWallStrippedClass = "lemon-wall-";
var lemonBGStrippedClass = "lemon-bg-";
var lemonBGClass = "lemon-background";

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
	"textLayerLocation" : {
		"x" : 0,
		"y" : 0
	},
	"textLayerSpeed" : {
		"x" : 0,
		"y" : 0
	},
	"textLayerPause" : {
		"start" : 0,
		"end" : 0
	},
	"textLayerWrap" : false,
	"textLayer" : [ [] ],
	"bgLayerSize" : {
		"x" : 0,
		"y" : 0
	},
	"bgLayerLocation" : {
		"x" : 0,
		"y" : 0
	},
	"bgLayerSpeed" : {
		"x" : 0,
		"y" : 0
	},
	"bgLayerPause" : {
		"start" : 0,
		"end" : 0
	},
	"bgLayerWrap" : false,
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
	newContent += 'name: <input type="text" id="' + packNameId
			+ '" value="NewName" /><br />';
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
	newContent += "<br /><br />";
	newContent += '<input type="button" value="Test this pack" '
			+ 'onclick="editorTestPack()" /><br />';
	newContent += '<input type="button" value="Display this pack as XML" '
			+ 'onclick="editorViewPackXML()" /><br />';
	newContent += '<input type="button" value="Display and create new pack" '
			+ 'onclick="editorFinishAndRestart()" /><br />';
	document.getElementById(editorId).innerHTML = newContent;
}

function editorViewPackXML() {
	var packStr = editorBuildPackXMLString();
	if (packStr == null || packStr == "") {
		alert("could not view empty pack");
		return;
	}
	// TODO Make it so it looks better on opening. That is find a way to open a
	// window where the browsers understands it is of XML format, and renders it
	// thereby.
	alert(packStr);
}

function editorFinishAndRestart() {
	editorViewPackXML();
	lemonEditorInit();
}

function editorTestPack() {
	var packStr = editorBuildPackXMLString();
	if (packStr == null) {
		alert("Pack build has failed. Testing aborted");
		return;
	}
	// This requires lemoneater.js and ExternalObjects.js to function
	extPack = lemonParsePackFromString(packStr);
	lemonInit();
	editorAfterTestStarts();
}

function editorBuildPackXMLString() {
	if ((editorGameOverTxt == null || editorGameOverTxt == "")
			&& (editorIntroTxt == null || editorIntroTxt == "")
			&& (editorLevelsTxt == null || editorLevelsTxt == "")
			&& (editorOutroTxt == null || editorOutroTxt == "")) {
		alert("Pack XML build failed");
		return null;
	}
	var outStr = '<?xml version="1.0" encoding="UTF-8"?>';
	outStr += '<lemon:lemon-eater xmlns:lemon="lemon-schema/" '
			+ 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
			+ 'xsi:schemaLocation="lemon-schema/ lemon-schema.xsd ">';
	outStr += "<name>" + parsedPackName + "</name>";
	if (editorIntroTxt != null)
		outStr += editorIntroTxt;
	if (editorOutroTxt != null)
		outStr += editorOutroTxt;
	if (editorGameOverTxt != null)
		outStr += editorGameOverTxt;
	if (editorLevelsTxt != null)
		outStr += editorLevelsTxt;
	outStr += "</lemon:lemon-eater>";
	return outStr;
}

function editorShowMainLevelScreen() {
	if (editorEditingLevel == null) {
		alert("Cannot edit empty level");
		return;
	}
	var v = editorEditingLevel.target == null ? 1 : editorEditingLevel.target;
	var newContent = "Target lemon count: ";
	newContent += '<input type="number" value="' + v + '" id="'
			+ editTargetCountId + '" onchange="editorTargetChanged()" /><br />';
	newContent += "Skippable level: ";
	newContent += '<input type="checkbox" id="'
			+ editSkipSelectId
			+ '" onclick="editorSkipChanged()" onchange="editorSkipChanged()" /><br />';
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
	document.getElementById(editorId).innerHTML = newContent;
	// Make skippable selected or not.
	document.getElementById(editSkipSelectId).checked = editorEditingLevel.skippable;
}

function editorSkipChanged() {
	editorEditingLevel.skippable = document.getElementById(editSkipSelectId).checked;
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
	editorAfterTestStarts();
}

function editorAfterTestStarts() {
	var focusContr = document.getElementById("lemon-focus-controller");
	if (focusContr) {
		focusContr.onblur = function() {
			var debugout = document.getElementById("debug-out");
			if (debugout) {
				debugout.innerHTML = "For testing porposes the behaviour of "
						+ "the game has changed. If control of eater is lost, "
						+ "press button on bottom of game screen.";
			}
		};
	}
}

function editorFinalizeCurrentLevel() {
	var lvlStr = editorTranslateEditingLevelToString(editorEditingLevel);
	if (lvlStr == null) {
		alert("Finalization aborted!");
		return;
	}
	switch (editorEditingLevel.id) {
	case introId:
		editorIntroTxt = lvlStr;
		break;
	case outroId:
		editorOutroTxt = lvlStr;
		break;
	case gameOverId:
		editorGameOverTxt = lvlStr;
		break;
	default:
		editorLevelsTxt += lvlStr;
		break;
	}
	editorShowMainPackScreen();
}

function editorShowTextLayerEditor() {
	if (editorEditingLevel == null) {
		alert("Misplaced edit text layer argument");
		return;
	}
	if (editorEditingLevel.textLayer == null)
		editorCreateNewTxtLayer();
	var textString = "";
	var newContent = editorBuildMovementHeader(
			editorEditingLevel.textLayerSpeed,
			editorEditingLevel.textLayerPause,
			editorEditingLevel.textLayerWrap,
			editorEditingLevel.textLayerLocation);
	for ( var y = 0; y < editorEditingLevel.textLayer.length; y++) {
		if (textString != "")
			textString += "\n";
		for ( var x = 0; x < editorEditingLevel.textLayer[y].length; x++) {
			textString += editorEditingLevel.textLayer[y][x];
		}
	}
	newContent += '<div id="' + editAreaId + '"><span class="' + lemonBGClass
			+ '">';
	newContent += '<textarea id="' + editTextAreaId + '" rows="'
			+ packDimensions.y + '" cols="' + packDimensions.x
			+ '" wrap="off">';
	newContent += textString + '</textarea>';
	newContent += '</span></div><br />';
	newContent += '<input type="button" '
			+ 'onclick="editorTextLayerCollectAndReturn()" '
			+ 'value="Back to level select" />';
	document.getElementById(editorId).innerHTML = newContent;
}

function editorTextLayerCollectAndReturn() {
	// Read text area, break it down to char array
	var text = document.getElementById(editTextAreaId).value;
	var y = 0;
	var x = 0;
	var newLayer = new Array();
	newLayer = new Array();
	newLayer[y] = new Array();
	for ( var i = 0; i < text.length; i++) {
		var char = text.charAt(i);
		if (char == "\n") {
			x = 0;
			y++;
			newLayer[y] = new Array();
		} else {
			newLayer[y][x++] = char;
		}
	}
	// Find out height and standardize
	if (newLayer.length < packDimensions.y) {
		alert("Number of lines in textarea was smaller than this editor "
				+ "handles. Extra spaces added");
		for ( var i = newLayer.length; i < packDimensions.y; i++)
			newLayer[i] = new Array();
	}
	// Find max width
	var max = 0;
	for ( var i = 0; i < newLayer.length; i++) {
		max = newLayer[i].length > max ? newLayer[i].length : max;
	}
	if (max < packDimensions.x) {
		alert("Width of widest line in textarea was smaller than this editor "
				+ "handles. Extra width added.");
		max = packDimensions.x;
	}
	// Standardize. Adding extra spaces if needed.
	for (y = 0; y < newLayer.length; y++) {
		for (x = newLayer[y].length; x < max; x++) {
			newLayer[y][x] = " ";
		}
	}
	// Sets the new text layer
	editorEditingLevel.textLayer = newLayer;
	// Sets size for later use
	editorEditingLevel.textLayerSize = {
		"x" : max,
		"y" : newLayer.length
	};
	// Location
	editorEditingLevel.textLayerLocation = {
		"x" : document.getElementById(editLocationXId).value * 1,
		"y" : document.getElementById(editLocationYId).value * 1
	};
	// Speed
	editorEditingLevel.textLayerSpeed = {
		"x" : document.getElementById(editSpeedXId).value * 1,
		"y" : document.getElementById(editSpeedYId).value * 1
	};
	// Pause
	var start = document.getElementById(editPauseStartId).value * 1;
	var end = document.getElementById(editPauseEndId).value * 1;
	if (start < 0)
		start = 0;
	if (end < 0)
		end = 0;
	editorEditingLevel.textLayerPause = {
		"start" : start,
		"end" : end
	};
	// Wrap
	editorEditingLevel.textLayerWrap = document.getElementById(editWrapId).checked;
	editorShowMainLevelScreen();
}

function editorCreateNewTxtLayer() {
	editorEditingLevel.textLayer = new Array();
	editorEditingLevel.textLayerSize = {
		"x" : 0,
		"y" : 0
	};
	editorEditingLevel.textLayerLocation = {
		"x" : 0,
		"y" : 0
	};
	editorEditingLevel.textLayerSpeed = {
		"x" : 0,
		"y" : 0
	};
	editorEditingLevel.textLayerPause = {
		"start" : 0,
		"end" : 0
	};
	editorEditingLevel.textLayerWrap = false;
}

function editorShowBGLayerEditor() {
	if (editorEditingLevel == null) {
		alert("Misplaced edit background argument");
		return;
	}
	if (editorEditingLevel.bgLayer == null) {
		editorShowSizeSelect(bgId);
	} else {
		editorShowBGRealEdit();
	}
}

function editorBuildMovementHeader(speed, pause, wrap, location) {
	var newContent = "Movement speed x-axis(100 is 1 block per tick):<br />";
	newContent += '<input type="number" id="' + editSpeedXId + '" value="'
			+ speed.x + '" /><br />';
	newContent += "Movement speed y-axis(100 is 1 block per tick):<br />";
	newContent += '<input type="number" id="' + editSpeedYId + '" value="'
			+ speed.y + '" /><br />';
	newContent += "Location x-axis:<br />";
	newContent += '<input type="number" id="' + editLocationXId + '" value="'
			+ location.x + '" /><br />';
	newContent += "Location y-axis:<br />";
	newContent += '<input type="number" id="' + editLocationYId + '" value="'
			+ location.y + '" /><br />';
	newContent += "Pause ticks before start:<br />";
	newContent += '<input type="number" id="' + editPauseStartId + '" value="'
			+ pause.start + '" /><br />';
	newContent += "Pause ticks after end:<br />";
	newContent += '<input type="number" id="' + editPauseEndId + '" value="'
			+ pause.end + '" /><br />';
	newContent += 'Wrap: <input type="checkbox" id="' + editWrapId + '" ';
	if (wrap)
		newContent += 'checked="checked" ';
	newContent += '/><br />';
	return newContent;
}

function editorShowBGRealEdit() {
	// Movement choices:
	var newContent = editorBuildMovementHeader(editorEditingLevel.bgLayerSpeed,
			editorEditingLevel.bgLayerPause, editorEditingLevel.bgLayerWrap,
			editorEditingLevel.bgLayerLocation);
	// Edit area:
	newContent += editorBuildFGBGEditArea(bgId);
	// Color choose area:
	newContent += editorBuildFGBGColorChooserArea(bgId);
	newContent += '<div><input type="button" '
			+ 'onclick="editorBGCollectAndReturn()" '
			+ 'value="Back to level select" /></div>';
	document.getElementById(editorId).innerHTML = newContent;
}

function editorBGCollectAndReturn() {
	// Speed
	editorEditingLevel.bgLayerSpeed = {
		"x" : document.getElementById(editSpeedXId).value * 1,
		"y" : document.getElementById(editSpeedYId).value * 1
	};
	// Location
	editorEditingLevel.bgLayerLocation = {
		"x" : document.getElementById(editLocationXId).value * 1,
		"y" : document.getElementById(editLocationYId).value * 1
	};
	// Pause
	var start = document.getElementById(editPauseStartId).value * 1;
	var end = document.getElementById(editPauseEndId).value * 1;
	if (start < 0)
		start = 0;
	if (end < 0)
		end = 0;
	editorEditingLevel.bgLayerPause = {
		"start" : start,
		"end" : end
	};
	// Wrap
	editorEditingLevel.bgLayerWrap = document.getElementById(editWrapId).checked;
	editorShowMainLevelScreen();
}

function editorCreateNewBGLayer() {
	editorEditingLevel.bgLayer = new Array();
	for ( var y = 0; y < editorEditingLevel.bgLayerSize.y; y++) {
		editorEditingLevel.bgLayer[y] = new Array();
		for ( var x = 0; x < editorEditingLevel.bgLayerSize.x; x++) {
			editorEditingLevel.bgLayer[y][x] = "0";
		}
	}
	editorEditingLevel.bgLayerSpeed = {
		"x" : 0,
		"y" : 0
	};
	editorEditingLevel.bgLayerLocation = {
		"x" : 0,
		"y" : 0
	};
	editorEditingLevel.bgLayerPause = {
		"start" : 0,
		"end" : 0
	};
	editorEditingLevel.bgLayerWrap = false;
}

function editorShowSizeSelect(layer) {
	var newContent = layer
			+ " layer size select<br />Do not exceed pack size<br />";
	newContent += 'x: <input type="number" id="' + editSizeXId + '" value="'
			+ packDimensions.x + '" /><br />';
	newContent += 'y: <input type="number" id="' + editSizeYId + '" value="'
			+ packDimensions.y + '" /><br />';
	newContent += '<input type="button" value="Done" onclick="editorSizeSelected(\''
			+ layer + '\')" />';
	document.getElementById(editorId).innerHTML = newContent;
}

function editorSizeSelected(layer) {
	var sizeX = document.getElementById(editSizeXId).value * 1;
	var sizeY = document.getElementById(editSizeYId).value * 1;
	if (sizeX < packDimensions.x || sizeY < packDimensions.y) {
		alert("Both text layer size and background size must be larger "
				+ "than pack size in this editor!");
		return;
	}
	if (layer == bgId) {
		if (editorEditingLevel.bgLayerSize == null)
			editorEditingLevel.bgLayerSize = new Object();
		editorEditingLevel.bgLayerSize.x = sizeX;
		editorEditingLevel.bgLayerSize.y = sizeY;
		editorCreateNewBGLayer();
		editorShowBGRealEdit();
	}
}

function editorTranslateArrayToContentString(array, skipSign, xtraData) {
	var output = "<content>";
	for ( var y = 0; y < array.length; y++) {
		for ( var x = 0; x < array[y].length; x++) {
			if (array[y][x] != skipSign)
				output += '<c x="' + x + '" y="' + y + '">'
						+ editorTranslateCharIfNeeded(array[y][x]) + '</c>';
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
	var output = "<layer>";
	output += editorBuildDescriptionString(bgId, editingLevel.bgLayerSize.x,
			editingLevel.bgLayerSize.y, editingLevel.bgLayerLocation.x,
			editingLevel.bgLayerLocation.y, editingLevel.bgLayerSpeed.x,
			editingLevel.bgLayerSpeed.y, editingLevel.bgLayerWrap,
			editingLevel.bgLayerPause.start, editingLevel.bgLayerPause.end,
			editingLevel.target);
	output += editorTranslateArrayToContentString(editingLevel.bgLayer, "0",
			null);
	output += "</layer>";
	return output;
}

function editorTranslateTxtLayerToString(editingLevel) {
	var output = "<layer>";
	output += editorBuildDescriptionString(txtId, editingLevel.textLayerSize.x,
			editingLevel.textLayerSize.y, editingLevel.textLayerLocation.x,
			editingLevel.textLayerLocation.y, editingLevel.textLayerSpeed.x,
			editingLevel.textLayerSpeed.y, editingLevel.textLayerWrap,
			editingLevel.textLayerPause.start, editingLevel.textLayerPause.end,
			editingLevel.target);
	output += editorTranslateArrayToContentString(editingLevel.textLayer, " ",
			null);
	output += "</layer>";
	return output;
}

function editorBuildFGBGEditArea(layerId) {
	var layer = null;
	var strippedClass = "";
	if (layerId == fgId) {
		layer = editorEditingLevel.fgLayer;
		strippedClass = lemonWallStrippedClass;
	} else if (layerId == bgId) {
		layer = editorEditingLevel.bgLayer;
		strippedClass = lemonBGStrippedClass;
	} else
		return "";
	var newContent = '<div id="' + editAreaId + '">';
	for ( var y = 0; y < layer.length; y++) {
		newContent += '<span class="' + lemonBGClass + '">';
		for ( var x = 0; x < layer[y].length; x++) {
			var classType = "";
			var t = layer[y][x];
			if (t != "0")
				classType = ' class="' + strippedClass + t + '"';
			newContent += '<span id="' + editCellStrippedId + 'x' + x + 'y' + y
					+ '"' + classType + '" onclick="editorEditCellClicked(' + x
					+ ',' + y + ",'" + layerId + '\')">';
			newContent += translations[" "] + '</span>';
		}
		newContent += '</span><br />';
	}
	newContent += '</div><br />';
	return newContent;
}

function editorBuildFGBGColorChooserArea(layerId) {
	var strippedClass = "";
	var chooseList = null;
	var selType = null;
	if (layerId == fgId) {
		strippedClass = lemonWallStrippedClass;
		chooseList = wallTypes;
		selType = editorEditingLevel.fgSelected;
	} else if (layerId == bgId) {
		strippedClass = lemonBGStrippedClass;
		chooseList = bgTypes;
		selType = editorEditingLevel.bgSelected;
	} else
		return "";
	var newContent = '<div id="' + editColorChooserId + '">';
	newContent += '<span class="' + lemonBGClass + '">';
	for ( var i = 0; i < chooseList.length; i++) {
		var type = chooseList[i];
		var classType = type == "0" ? "" : 'class="' + strippedClass + type
				+ '"';
		newContent += '<span ' + classType
				+ ' onclick="editorColorChooserCellClicked(\'' + type + '\',\''
				+ layerId + '\')">' + translations[" "] + translations[" "]
				+ '</span>';
	}
	if (layerId == fgId) {
		newContent += '<br /><span id="' + editEaterSelectId
				+ '" onclick="editorSpawnPointSelectClicked()">';
		newContent += '<span class="' + lemonEaterHeadClass + '">'
				+ translations[" "] + '</span>';
		newContent += '<span class="' + lemonEaterBodyClass + '">'
				+ translations[" "] + translations[" "] + translations[" "]
				+ translations[" "] + '</span>';
		newContent += '</span>';
	}
	var chosenClass = "";
	if (selType != null || selType != "0")
		chosenClass = ' class="' + strippedClass + selType + '"';
	newContent += '<br /><span id="' + editColorSelectedId + '"' + chosenClass
			+ '>' + translations[" "] + translations[" "] + '</span>';
	newContent += '</span></div><br />';
	return newContent;
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
	var newContent = editorBuildFGBGEditArea(fgId);
	newContent += editorBuildFGBGColorChooserArea(fgId);
	// Return button
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
		cName = lemonBGStrippedClass + editorEditingLevel.bgSelected;
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
	} else if (layer == bgId) {
		cName = lemonBGStrippedClass + editorEditingLevel.bgLayer[y * 1][x * 1];
	} else {
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
	editorEditingLevel.target = 1;
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

function editorTranslateCharIfNeeded(oldChar) {
	if (translations[oldChar] == null)
		return oldChar;
	else
		return translations[oldChar];
}
