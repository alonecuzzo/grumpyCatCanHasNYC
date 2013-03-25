//our game business

//constants
var KEYCODE_UP         = 38,
	KEYCODE_DOWN       = 40,
	KEYCODE_SPACE      = 32,
	//size constants
	UNICORN_W          = 150,
	UNICORN_H          = 141,
	CAT_W              = 138,
	CAT_H              = 83,
	//speed constants
	BURGER_SPEED       = 17,
	BURGER_TIME        = 5,  //ticks between cheezburgerz
	UNICORN_SPEED      = 2,
	UNICORN_DIFF       = 250,
	UNICORN_PTS        = 2321,
	UNICORN_FIRE_DELAY = 100,
	LAZER_SPEED        = 17,
	CAT_ACCEL          = 0.2,
	SURVIVAL_PTS       = 1;

//booleans
var isGCAlive,
	isUpHeld      = false,
	isDownHeld    = false,
	isFireHeld    = false,
	isGameActive  = false;

//assets
var assets,
	loader,
	building,
	grumpyCat,
	sky,
	stage,
	scoreText,
	titleScreenBkgrnd,
	titleScreenText;

//variables
var tickIndex     = 0,
	burgerArray   = [],
	unicornArray  = [],
	w,
	h,
	vy            = 0,
	ay            = 0,
	points        = 0;

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
        {src:"img/sky.png", id:"sky"},
        {src:"img/titleScreen_bkgrnd.png", id:"titleScreenBkgrnd"}
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
				isGCAlive = true;
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
			case "titleScreenBkgrnd":
				titleScreenBkgrnd = new createjs.Shape(new createjs.Graphics().beginBitmapFill(result).drawRect(0,0,w,h));
				break;
		}
	}
	stage.addChild(sky, buildings, grumpyCat, scoreText, titleScreenBkgrnd);
	createTitleScreen();
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

function fireLazer(unicorn) {
	var l = new createjs.Bitmap(loader.getResult("lazer"));
	l.x = unicorn.x;
	l.y = unicorn.y;
	unicorn.lazerArray.push(l);
	stage.addChild(l);
}

//removes all children in an array from display list
function removeChildren(array) {
	var i;
	for(i=0; i<=array.length-1; i++) {
		stage.removeChild(array[i]);
	}
}

function generateUnicorn() {
	var u          = new createjs.Bitmap(loader.getResult("unicorn"));
	u.lazerCounter = 0;
	u.lazerArray   = [];
	u.x            = w - 20;
	u.y            = Math.random() * h;
	//force unicorns on screen 
	if(u.y >= (h - UNICORN_H)){ u.y = h - UNICORN_H; }
    if(u.y <= 0) { u.y = 0; }

	unicornArray.push(u);
	stage.addChild(u);
}

function createTitleScreen() {
	titleScreenText 	= new createjs.Text("Welcome to our game, click anywhere to begin!", "30px Arial", "#FFF");
	titleScreenText.textAlign = "center";
	titleScreenText.x 	= w / 2;
	titleScreenText.y 	= h / 2 - 25;
	stage.addChild(titleScreenText);
	titleScreenBkgrnd.addEventListener('click', startGame);
}

function startGame() {
	removeChildren([titleScreenBkgrnd, titleScreenText]);
	isGameActive 	= true;
}

function gameover() {
	var gameOverTitle = new createjs.Text("GameOver", "60px Arial", "#FFF");
	gameOverTitle.textAlign = "center";
	gameOverTitle.x = w / 2;
	gameOverTitle.y = h / 2;
	stage.removeChild(grumpyCat);
	stage.addChild(gameOverTitle);
	isGCAlive =false;
}

function isHit(u){
	collisionMethod = ndgmr.checkPixelCollision;
	var intersection = collisionMethod(grumpyCat,u,0.75);
	if (intersection) {return true;} 
	else {return false;}
}

function tick(event) {
	if(isGameActive){
		//Buildings
		var outside = w + 15;
		buildings.x = (buildings.x - 1.8);
		if(buildings.x + 103 <= 0) { buildings.x = outside; }

		//position of GrumpyCat
		vy += ay;
		grumpyCat.y += vy;

		//force GrumpyCat on screen
		if(grumpyCat.y >= (h - CAT_H)){ grumpyCat.y = h - CAT_H; }
		if(grumpyCat.y <= 0) { grumpyCat.y = 0; }

		//you get points for just surviving 
		if(isGCAlive){ points += SURVIVAL_PTS; }
		scoreText.text = points;

		//Unicorn appears on scren based on difficulty
		if((tickIndex % UNICORN_DIFF) === 0){ generateUnicorn(); }

		//handle burger firing: accelerates and destroys burger
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
						removeChildren(unicornArray[j].lazerArray);
						stage.removeChild(unicornArray[j]);
						unicornArray.lazerArray = [];
						unicornArray.splice(j, 1);
					}
				}
			}
		}
		for(i=0; i<=unicornArray.length-1; i++) {
			if (isHit(unicornArray[i])){gameover();}
			var k;
			for(k=0; k<=unicornArray[i].lazerArray.length-1; k++) {
				var pt2 = unicornArray[i].lazerArray[k].localToLocal(0,0,grumpyCat);
				if(grumpyCat.hitTest(pt2.x, pt2.y)) {
					gameover();
				}
			}
		}

		for(i=0; i<= unicornArray.length-1; i++){
			unicornArray[i].x = unicornArray[i].x - UNICORN_SPEED;
			unicornArray[i].lazerCounter++;

			if((unicornArray[i].lazerCounter % UNICORN_FIRE_DELAY) === 0) {
				fireLazer(unicornArray[i]);
			}
			var k;
			for(k=0; k<=unicornArray[i].lazerArray.length-1; k++) {
				var l = unicornArray[i].lazerArray[k];
				l.x -= LAZER_SPEED;
				if(l.x <= -100) { //should use the lazer's actual width
					stage.removeChild(l);
					unicornArray[i].lazerArray.splice(k, 1);
				}
			}

			//remove unicorn when off screen 
			if(unicornArray[i].x <= -UNICORN_W) {
				stage.removeChild(unicornArray[i]);
				unicornArray[i].lazerArray = [];
				unicornArray[i] = null;
				unicornArray.splice(i, 1);
			}
		}
		tickIndex++;
	}
	stage.update(event);
}

