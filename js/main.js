//our game business
var assets;
var stage;
var w, h;
var building, cheezburger,grumpyCat,lazer,unicorn;


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
		            {src:"img/unicorn.png", id:"unicorn"}
		            //{src:"wall.mp3|wall.ogg", id:"wall"}
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
			case "buildings":
				buildings = new createjs.Bitmap(result);
				buildings.x = 500;
				stage.addChild(buildings);
		}
		
			
	
	}


	// grumpyCat = loader.getResult("grumpyCat");
	// stage.addChild(grumpyCat);

	stage.update();

	// createjs.Ticker.setFPS(30);
	// createjs.Ticker.addEventListener("tick", tick);
}

// function tick(event) {

// 	stage.update(event);
// }

