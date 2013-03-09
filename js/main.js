//our game business
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;
var KEYCODE_SPACE = 32;

var BURGER_SPEED = 17; //how fast cheezburgerz move
var BURGER_TIME = 5; //ticks between cheezburgerz

var UNICORN_SPEED = 2;
var UNICORN_DIFF = 250;

var TICKER_ADD= 500;

var assets, loader;
var stage;
var w, h, vy = 0, ay = 0;
var building, cheezburger, grumpyCat, lazer, unicorn, sky;

var upheld = dwheld = fireheld = false;

var alive; //is grumpyCat alive?
var burgerArray = [];
var unicornArray = [];
var tickIndex = 0;

var CAT_W = 138;
var CAT_H = 83;

var UNICORN_W = 150;
var UNICORN_H = 141;

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
				grumpyCat.x = w - (w-100);
				grumpyCat.y = 100;
				// stage.addChild(grumpyCat);
				break;
			case "unicorn":
				// unicorn = new createjs.Bitmap(result);
				// unicorn.x = w - 500;
				// stage.addChild(unicorn);
				break;
			case "cheezburger":
				// cheezburger = new createjs.Bitmap(result);
				// stage.addChild(cheezburger);
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

function handleKeyDown(e){

	if (e.which == KEYCODE_UP) { 
		// upheld = true;
		ay = -0.2;
	}
		// grumpyCat.y = (grumpyCat.y - 9);

	if (e.which == KEYCODE_DOWN) { ay = 0.2; }
		// grumpyCat.y = (grumpyCat.y + 9);

	if (e.which == KEYCODE_SPACE)
		fireCheezburger();

	//console.log("OMFG");
}

function handleKeyUp(e){

	// if(upheld == true){
	// 	ay = 0.2
	// 	console.log(upheld);
	// }
	vy = 0;
	ay = 0;
}

function fireCheezburger(){ //138X83
	var cb = new createjs.Bitmap(loader.getResult("cheezburger"));
	cb.x = (grumpyCat.x * 2) + 37;
	cb.y = (grumpyCat.y + 42);
	burgerArray.push(cb);
	//createjs.Sound.play("laser", createjs.Sound.INTERUPT_LATE);

	stage.addChild(cb);

}	
// function outOfBounds(o, bounds) {
// 	//is it visibly off screen
// 	return o.x < bounds*-2 || o.y < bounds*-2 || o.x > canvas.width+bounds*2 || o.y > canvas.height+bounds*2;
// }

function unicornAttack(){
	var u =  new createjs.Bitmap(loader.getResult("unicorn"));
	// u.scaleX=u.scaleY = 0.8;
	u.x = w - 20;
	u.y = Math.random()* h;
	unicornArray.push(u);
	stage.addChild(u);

}

function hitTest(a){
	if(a.x == (grumpyCat.x + CAT_W)){

			console.log("hit");
	}



}

function tick(event) {

	//Buildings
	var outside = w + 15;
	buildings.x = (buildings.x - 1.8);
	if(buildings.x + 103 <= 0) {buildings.x = outside;}
	
	//grumpyMoves
	document.onkeydown = handleKeyDown;

    document.onkeyup = handleKeyUp;

    vy += ay;
    grumpyCat.y += vy;

    var i;
    for(i=0; i<=burgerArray.length-1; i++) {
    	burgerArray[i].x = burgerArray[i].x + BURGER_SPEED;
    	if(burgerArray[i].x >= w + 10) {
    		stage.removeChild(burgerArray[i]);
    		burgerArray.splice(i, 1);
    		// console.log('cyz bigot!');
    	}
    }
    
    if ((tickIndex % UNICORN_DIFF) == 0){

    	unicornAttack();

    	// if((tickIndex % TICKER_ADD == 0){
    	// 	UNICORN_DIFF = (UNICORN_DIFF*2);
    	// }
    }
    
    for(i=0; i<= unicornArray.length-1; i++){
    	unicornArray[i].x = unicornArray[i].x - UNICORN_SPEED;
    	hitTest(unicornArray[i]);
    	// if(unicornArray[i].x == grumpyCat.x && unicornArray.y == grumpyCat.y){
    	// 	console.log('crash');
    	// }
    }
    //vx = 0;ax = 0; vx +=ax; ball.y = vx;
    tickIndex ++;
	stage.update(event);
	
}

