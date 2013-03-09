//our game business
function init() {
	var building, cheezburger,grumpyCat,lazer,unicorn;

	// get a reference to the canvas we'll be working with:
	var canvas = document.getElementById("testCanvas");

	var w = canvas.width;
	var h = canvas.height;

	// create a stage object to work with the canvas. This is the top level node in the display list:
	var stage = new createjs.Stage(canvas);

	manifest = [
		            {src:"img/buildings.png", id:"buildings"},
		            {src:"img/cheezburger.png", id:"cheezburger"},
		            {src:"img/grumpyCat.png", id:"grumpyCat"},
		            {src:"img/lazer.png", id:"lazer"},
		            {src:"img/unicorn.png", id:"unicorn"}
		            //{src:"wall.mp3|wall.ogg", id:"wall"}
		        ];

    var assets = []; //gets populated on load

	var loader = new createjs.LoadQueue(false);
    loader.onFileLoad = handleFileLoad;
    loader.onComplete = handleComplete;
    loader.loadManifest(manifest);
    stage.autoClear = false;

   		       

    function handleFileLoad(event) {
		assets.push(event.item);
	}

	function handleComplete() {

		for(var i=0; i < assets.length;i++) {
			var item = assets[i];
			var id = item.id;
			var result = loader.getResult(id);

			if (item.type == createjs.LoadQueue.IMAGE) {
				var bmp = new createjs.Bitmap(result);
			}
	}

	var grumpyCat = loader.getResult("grumpyCat");
	stage.addChild(grumpyCat);
        

	// Create a new Text object:
	// var text = new createjs.Text("GRUMPY CAT CAN HAS SAVE TEH CITY!", "36px Arial", "#777");

	// // add the text as a child of the stage. This means it will be drawn any time the stage is updated
	// // and that it's transformations will be relative to the stage coordinates:
	// stage.addChild(text);

	// // position the text on screen, relative to the stage coordinates:
	// text.x = 200;
	// text.y = 200;

	// call update on the stage to make it render the current display list to the canvas:
	stage.update();
}