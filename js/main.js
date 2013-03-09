//our game business
var assets;
var stage;
var w, h;
var building, cheezburger, grumpyCat, lazer, unicorn, sky;


function init() {

	// get a reference to the canvas we'll be working with:
	var canvas = document.getElementById("testCanvas");

	w = canvas.width;
	h = canvas.height;

	// create a stage object to work with the canvas. This is the top level node in the display list:
	stage = new createjs.Stage(canvas);

	manifest = [
        {src:"img/buildings.png", id:"buildings"},
        {src:"img/cheezburger.png", id:"cheezburger"},
        {src:"img/grumpyCat.png", id:"grumpyCat"},
        {src:"img/lazer.png", id:"lazer"},
        {src:"img/unicorn.png", id:"unicorn"},
        {src:"img/sky.png", id:"sky"}
    ];

    assets = []; //gets populated on load

	loader = new createjs.LoadQueue(false);
    loader.onFileLoad = handleFileLoad;
    loader.onComplete = handleComplete;
    loader.loadManifest(manifest);
    stage.autoClear = false;
}

function handleFileLoad(event) {
	assets.push(event.item);
}

function handleComplete() {

	for(var i=0; i < assets.length;i++) {
		var item = assets[i];
		var id = item.id;
		var result = loader.getResult(id);

		switch(id){
			case "sky":
				sky = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,w,h));
				break;
			case "grumpyCat":
				grumpyCat = new createjs.Bitmap(result);
				grumpyCat.x= 200;
				stage.addChild(grumpyCat);
				break;
			case "unicorn":
				unicorn = new createjs.Bitmap(result);
				unicorn.x = 700;
				stage.addChild(unicorn);
				break;
			case "cheezburger":
				cheezburger = new createjs.Bitmap(result);
				cheezburger.x = 400;
				cheezburger.y = 50;
				stage.addChild(cheezburger);
				break;
			case "buildings":
				// buildings = new createjs.Bitmap(result);
				buildings = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,100,200));
				buildings.x = 500;
				buildings.y = h - 200;
				break;
		}
	}
	//stage.update();
	stage.addChild(sky, buildings, grumpyCat);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	var outside = w + 15;
	buildings.x = (buildings.x - 1.8);
	if(buildings.x + 103 <= 0) {buildings.x = outside;}
	stage.update(event);
}

