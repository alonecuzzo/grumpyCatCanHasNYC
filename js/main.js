//our game business

//constants
var KEYCODE_UP    = 38,
	KEYCODE_DOWN  = 40,
	KEYCODE_SPACE = 32,
	//size constants
	UNICORN_W     = 150,
	UNICORN_H     = 141,
	CAT_W         = 138,
	CAT_H         = 83,
	//speed constants
	BURGER_SPEED  = 17, //how fast cheezburgerz move
	BURGER_TIME   = 5,  //ticks between cheezburgerz
	UNICORN_SPEED = 2,
	UNICORN_DIFF  = 250,
	UNICORN_PTS   = 2321,
	CAT_ACCEL     = 0.2;

//booleans
var isGCAlive,
	isUpHeld      = false,
	isDownHeld    = false,
	isFireHeld    = false;

//assets
var assets,
	loader,
	building,
	grumpyCat,
	unicorn,
	sky,
	stage,
	scoreText;

//variables
var tickIndex    = 0,
	burgerArray  = [],
	unicornArray = [],
	w,
	h,
	vy           = 0,
	ay           = 0,
	points       = 0;

function init() {
	var canvas = document.getElementById("testCanvas");
	w          = canvas.width;
	h          = canvas.height;
    assets     = [];
	// create a stage object to work with the canvas. This is the top level node in the display list:
	stage      = new createjs.Stage(canvas);
	manifest   = [
        {src:"img/buildings.png", id:"buildings"},
        {src:"img/cheezburger.png", id:"cheezburger"},
        {src:"img/grumpyCat.png", id:"grumpyCat"},
        {src:"img/lazer.png", id:"lazer"},
        {src:"img/unicorn.png", id:"unicorn"},
        {src:"img/sky.png", id:"sky"}
    ];

	loader            = new createjs.LoadQueue(false);
    loader.onFileLoad = handleFileLoad;
    loader.onComplete = handleComplete;
    loader.loadManifest(manifest);
    stage.autoClear   = false;

    scoreText = new createjs.Text(points, "36px Arial", "#FFF");
    scoreText.textAlign = "right";
    scoreText.x = w - 25;
    scoreText.y = 20;

    //grumpyMoves & fires
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}

function handleFileLoad(event) {
	assets.push(event.item);
}

function handleComplete() {
	for(var i=0; i < assets.length;i++) {
		var item   = assets[i],
			id     = item.id,
			result = loader.getResult(id);

		switch(id){
			case "sky":
				sky = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,w,h));
				break;
			case "grumpyCat":
				grumpyCat   = new createjs.Bitmap(result);
				grumpyCat.x = w - (w-100);
				grumpyCat.y = 100;
				break;
			case "unicorn":
				break;
			case "cheezburger":
				break;
			case "buildings":
				// buildings = new createjs.Bitmap(result);
				buildings   = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,100,200));
				buildings.x = 500;
				buildings.y = h - 200;
				break;
		}
	}
	stage.addChild(sky, buildings, grumpyCat, scoreText);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);
}

function handleKeyDown(e) {
	switch(e.which) {
		case KEYCODE_UP:
			ay = -CAT_ACCEL;
			// isUpHeld = true;
			break;
		case KEYCODE_DOWN:
			ay = CAT_ACCEL;
			break;
		case KEYCODE_SPACE:
			fireCheezburger();
			break;
	}
}

function handleKeyUp(e) {
	vy = 0;
	ay = 0;
}

function fireCheezburger() {
	var cb = new createjs.Bitmap(loader.getResult("cheezburger"));
	cb.x   = (grumpyCat.x * 2) + 37;
	cb.y   = (grumpyCat.y + 42);
	burgerArray.push(cb);
	//createjs.Sound.play("laser", createjs.Sound.INTERUPT_LATE);
	stage.addChild(cb);
}

// function outOfBounds(o, bounds) {
// 	//is it visibly off screen
// 	return o.x < bounds*-2 || o.y < bounds*-2 || o.x > canvas.width+bounds*2 || o.y > canvas.height+bounds*2;
// }

function unicornAttack() {
	var u = new createjs.Bitmap(loader.getResult("unicorn"));
	u.x   = w - 20;
	u.y   = Math.random() * h;
	//force unicorns on screen -- we should probably make this a function to make it fancier
	if(u.y >= (h - UNICORN_H)){ u.y = h - UNICORN_H; }
    if(u.y <= 0) { u.y = 0; }

	unicornArray.push(u);
	stage.addChild(u);
}

function tick(event) {
	//Buildings
	var outside = w + 15;
	buildings.x = (buildings.x - 1.8);
	if(buildings.x + 103 <= 0) { buildings.x = outside; }

	
    vy += ay;
    grumpyCat.y += vy;
    //force him on screen
    if(grumpyCat.y >= (h - CAT_H)){ grumpyCat.y = h - CAT_H; }
    if(grumpyCat.y <= 0) { grumpyCat.y = 0; }

    //handle burger firing 
    var i;
    for(i=0; i<=burgerArray.length-1; i++) {
		burgerArray[i].x = burgerArray[i].x + BURGER_SPEED;
		if(burgerArray[i].x >= w + 10) {
			stage.removeChild(burgerArray[i]);
			burgerArray.splice(i, 1);
		} else {
			//check and see if the burger has hit anything
			var j;
			for(j=0; j<=unicornArray.length-1; j++) {
				var pt = burgerArray[i].localToLocal(0, 0, unicornArray[j]);
				if(unicornArray[j].hitTest(pt.x, pt.y)) {
					points += UNICORN_PTS;
					scoreText.text = points;
					stage.removeChild(unicornArray[j]);
					unicornArray.splice(j, 1);
				}
			}
		}
    }

	if((tickIndex % UNICORN_DIFF) === 0){
		unicornAttack();
    }

    for(i=0; i<= unicornArray.length-1; i++){
		unicornArray[i].x = unicornArray[i].x - UNICORN_SPEED;
		// hitTest(unicornArray[i]);
		//if(unicornArray[i].x == grumpyCat.x && unicornArray.y == grumpyCat.y){
		//console.log('crash');
		//}
    }
    tickIndex++;
	stage.update(event);
}

