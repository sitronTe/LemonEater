var extPack;

function lemonParsePackFromString(packString) {
	var parser = new DOMParser();
	var xml = parser.parseFromString(packString, "text/xml");
	return new LemonExternalPack(xml);
}

// TODO Change this function to load from external source.
function lemonLoadLemonEater() {
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(tmpxmlpack, "text/xml");
	extPack = new LemonExternalPack(xmlDoc);
	lemonInit();
}
// TODO Make sure they parse according to lemon-schema.xsd
// TODO Migrate into lemoneater.js
/*
 * Objects to parse externally stored objects.
 */

function LemonExternalPack(externalPackRaw) {
	this.name = externalPackRaw.getElementsByTagName("name")[0].childNodes[0].nodeValue;
	this.urlLocations = null;
	this.scoreboard = null;
	this.levelDatas = new Array();
	var urls = externalPackRaw.getElementsByTagName("url-locations");
	if (urls.length > 0)
		this.urlLocations = new LemonExternalURL(urls[0]);
	var scores = externalPackRaw.getElementsByTagName("eater-scoreboard");
	if (scores.length > 0)
		this.scoreboard = new LemonExternalScoreboard(scores[0]);
	var datas = externalPackRaw.getElementsByTagName("data");
	for ( var i = 0; i < datas.length; i++) {
		this.levelDatas[i] = new LemonExternalData(datas[i]);
	}
}

function LemonExternalURL(urlLocations) {
	this.fetchScoreboardFrom = urlLocations
			.getElementsByTagName("scoreboard-fetch")[0].nodeValue;
	this.submitScoreboardTo = urlLocations
			.getElementsByTagName("scoreboard-submit")[0].nodeValue;
	this.levelPackLocation = urlLocations
			.getElementsByTagName("level-pack-location")[0].nodeValue;
}

function LemonExternalScoreboard(scoreboard) {
	this.levelPackName = scoreboard.getElementsByTagName("level-pack-name")[0].nodeValue;
	this.entries = new Array();
	var entryList = scoreBoard.getElementsByTagName("entry");
	for ( var i = 0; i < entryList.length; i++) {
		var entry = new Object();
		entry.playerName = entryList[i].getElementsByTagName("player-name")[0].nodeValue;
		entry.finalLevel = entryList[i].getElemetsByTagName("final-level")[0].nodeValue;
		entry.score = entryList[i].getElementsByTagName("score")[0].nodeValue * 1;
		entry.totalLemonsEaten = entryList[i]
				.getElementsByTagName("total-lemons-eaten")[0].nodeValue * 1;
		this.entries[i] = entry;
	}
}

function LemonExternalData(dataNode) {
	this.bgLayer = null;
	this.txtLayer = null;
	this.lvlLayer = null;
	this.idType = dataNode.getElementsByTagName("id")[0].childNodes[0].nodeValue;
	var dim = dataNode.getElementsByTagName("dimension")[0];
	var wi = dim.getElementsByTagName("width")[0].childNodes[0].nodeValue * 1;
	var he = dim.getElementsByTagName("height")[0].childNodes[0].nodeValue * 1;
	this.dimension = new LemonPoint(wi, he);
	this.skippable = dataNode.getElementsByTagName("skippable")[0].childNodes[0].nodeValue == "true";
	var layers = dataNode.getElementsByTagName("layer");
	for ( var i = 0; i < layers.length; i++) {
		var descr = layers[i].getElementsByTagName("description")[0];
		var cont = layers[i].getElementsByTagName("content")[0];
		var parsedDescr = new LemonExternalLayerDescription(descr);
		if (parsedDescr.type == "text") {
			if (this.txtLayer != null)
				alert("Multiple text layers recognized! Only most recent kept!");
			this.txtLayer = new LemonExternalTextOrBackgroundLayer(parsedDescr,
					cont);
		} else if (parsedDescr.type == "background") {
			if (this.bgLayer != null)
				alert("Multiple backround layers recognized! Only most recent kept!");
			this.bgLayer = new LemonExternalTextOrBackgroundLayer(parsedDescr,
					cont);
		} else if (parsedDescr.type == "level") {
			if (this.lvlLayer != null)
				alert("Multiple level layers recognized! Only most recent kept!");
			this.lvlLayer = new LemonExternalBoard(parsedDescr, cont);
		} else {
			alert("Could not recognize layer type!" + parsedDescr.type);
		}
	}
}

/**
 * Creates a new <code>LemonExternalLayerDescription</code>.
 * 
 * @param boardWidth
 *            width of board this layer belongs to
 * @param boardHeight
 *            height of board this layer belongs to
 * @param layerDescription
 *            the content of the description element to read
 */
function LemonExternalLayerDescription(layerDescription) {
	// Reads the layer description
	this.type = layerDescription.getElementsByTagName("type")[0].childNodes[0].nodeValue;

	var dim = layerDescription.getElementsByTagName("dimension")[0];
	var sWidth = (dim.getElementsByTagName("width")[0].childNodes[0].nodeValue) * 1;
	var sHeight = (dim.getElementsByTagName("height")[0].childNodes[0].nodeValue) * 1;
	this.dimension = new LemonPoint(sWidth, sHeight);

	var loc = layerDescription.getElementsByTagName("location")[0];
	var x = (loc.getElementsByTagName("x")[0].childNodes[0].nodeValue) * 1;
	var y = (loc.getElementsByTagName("y")[0].childNodes[0].nodeValue) * 1;
	this.location = new LemonPoint(x, y);

	var mov = layerDescription.getElementsByTagName("move")[0];
	var vel = mov.getElementsByTagName("speed")[0];
	var wra = mov.getElementsByTagName("wrap")[0];
	var pau = mov.getElementsByTagName("pause")[0];
	var dx = vel.getElementsByTagName("x")[0].childNodes[0].nodeValue;
	var dy = vel.getElementsByTagName("y")[0].childNodes[0].nodeValue;
	this.velocity = new LemonPoint(dx, dy);
	this.wrap = wra.childNodes[0].nodeValue == "true";
	this.pauseBeforeStart = (pau.getElementsByTagName("start")[0].childNodes[0].nodeValue) * 1;
	this.pauseAfterEnd = (pau.getElementsByTagName("end")[0].childNodes[0].nodeValue) * 1;
	this.targetCount = (layerDescription.getElementsByTagName("target")[0].childNodes[0].nodeValue) * 1;
}

/**
 * Creates a new <code>LemonExternalTextLayer</code> from the XML in
 * layerContent. This should be used to parse externally stored text layers.
 * 
 * @param parsedLayerDescription
 *            already read layer description of type
 *            <code>LemonExternalLayerDescription</code>
 * @param layerContent
 *            the content of the description element to read
 */
function LemonExternalTextOrBackgroundLayer(parsedLayerDescription,
		layerContent) {
	this.type = parsedLayerDescription.type;
	this.dimension = parsedLayerDescription.dimension;
	this.location = parsedLayerDescription.location;
	this.velocity = parsedLayerDescription.velocity;
	this.wrap = parsedLayerDescription.wrap;
	this.pauseBeforeStart = parsedLayerDescription.pauseBeforeStart;
	this.pauseAfterEnd = parsedLayerDescription.pauseAfterEnd;
	// Parse content layer
	this.moveables = new Array();
	var cells = layerContent.getElementsByTagName("c");
	for ( var i = 0; i < cells.length; i++) {
		var xPos = (cells[i].getAttribute("x")) * 1;
		var yPos = (cells[i].getAttribute("y")) * 1;
		var val = cells[i].childNodes[0].nodeValue;
		this.moveables[i] = new LemonMoveableElement(xPos, yPos, val);
	}
}

/**
 * Creates a new <code>LemonExternalBoard</code> from the XML in layerContent.
 * This should be used to parse externally stored levels.
 * 
 * @param parsedLayerDescription
 *            already read layer description of type
 *            <code>LemonExternalLayerDescription</code>
 * @param layerContent
 *            the content of the description element to read
 */
function LemonExternalBoard(parsedLayerDescription, layerContent) {
	this.dimension = parsedLayerDescription.dimension;
	this.location = parsedLayerDescription.location;
	this.target = parsedLayerDescription.targetCount * 1;
	this.board = new Array();
	this.pauseBeforeStart = parsedLayerDescription.pauseBeforeStart;
	this.pauseAfterEnd = parsedLayerDescription.pauseAfterEnd;
	this.lemonSpawn = new LemonPoint(0, 0);
	// Initialize board
	for ( var y = 0; y < this.dimension.y; y++) {
		this.board[y] = new Array();
		for ( var x = 0; x < this.dimension.x; x++) {
			this.board[y][x] = "0";
		}
	}
	// Read board from layerContent XML
	var cells = layerContent.getElementsByTagName("c");
	for ( var i = 0; i < cells.length; i++) {
		var xPos = (cells[i].getAttribute("x")) * 1;
		var yPos = (cells[i].getAttribute("y")) * 1;
		var val = cells[i].childNodes[0].nodeValue;
		if (val == 'L') {
			this.lemonSpawn = new LemonPoint(xPos, yPos);
		} else {
			// TODO Perhaps more than just numbers 0-9?
			this.board[yPos][xPos] = val;
		}
	}
}
// TODO REMOVE!!!!!
var tmpxmlpack = '<lemon:lemon-eater xmlns:lemon="lemon-schema/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="lemon-schema/ lemon-schema.xsd "><name>Test Pack</name><data><id>intro</id><dimension><width>80</width><height>30</height></dimension><skippable>true</skippable><layer><description><type>background</type><dimension><width>160</width><height>45</height></dimension><location><x>0</x><y>0</y></location><move><speed><x>100</x><y>100</y></speed><wrap>true</wrap><pause><start>10</start><end>5</end></pause></move><target>0</target></description><content><c x="15" y="15">f</c><c x="10" y="10">5</c><c x="150" y="40">d</c></content></layer><layer><description><type>text</type><dimension><width>80</width><height>45</height></dimension><location><x>0</x><y>0</y></location><move><speed><x>0</x><y>100</y></speed><wrap>true</wrap><pause><start>5</start><end>5</end></pause></move><target>0</target></description><content><c x="15" y="15">f</c><c x="10" y="10">5</c><c x="50" y="40">d</c></content></layer></data><data><id>1</id><dimension><width>80</width><height>30</height></dimension><skippable>false</skippable><layer><description><type>background</type><dimension><width>160</width><height>45</height></dimension><location><x>0</x><y>0</y></location><move><speed><x>1</x><y>1</y></speed><wrap>true</wrap><pause><start>10</start><end>5</end></pause></move><target>0</target></description><content><c x="15" y="15">f</c><c x="10" y="10">5</c><c x="150" y="40">d</c></content></layer><layer><description><type>level</type><dimension><width>80</width><height>30</height></dimension><location><x>0</x><y>0</y></location><move><speed><x>0</x><y>0</y></speed><wrap>true</wrap><pause><start>0</start><end>0</end></pause></move><target>5</target></description><content><c x="15" y="15">L</c><c x="10" y="10">5</c><c x="50" y="20">1</c></content></layer><layer><description><type>text</type><dimension><width>80</width><height>45</height></dimension><location><x>0</x><y>0</y></location><move><speed><x>0</x><y>1</y></speed><wrap>true</wrap><pause><start>5</start><end>5</end></pause></move><target>0</target></description><content><c x="15" y="15">f</c><c x="10" y="10">5</c><c x="50" y="40">d</c></content></layer></data></lemon:lemon-eater>';