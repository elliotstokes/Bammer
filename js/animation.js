var _GameState;
var _Ship;
var _IntervalId;
var _CanvasElement;
var _Context;
var _Preloader;

//Main animation function which handles animating everything
function animate()
{
	
		var context = _Context;
		//Clear last steps stuff
		context.clearRect(0,0,_GameState.CanvasWidth,_GameState.CanvasHeight);
				
		if (!_GameState.Started)
		{
			//Show the startup screen
			context.font         = 'bold 30px sans-serif';
			context.strokeText('Canvas Game - Press S to start', 0, 50);
			if (_GameState.KeysPressed[7])
			{
				_GameState.Started=true;
				_GameState.playSound("backgroudSound");
			}
		}
		else if (_GameState.ShotCount > _GameState.DamageLimit)
		{
				//Show end
				context.font         = 'bold 30px sans-serif';
				context.strokeText('Game over - Press S to start', 0, 50);
				if (_GameState.KeysPressed[7])
				{
					_GameState.reset();
				}
		}
		else
		{
			
			_GameState.Enemies.render();
			_Ship.render();
			
			
			if (_GameState.KeysPressed[4])
			{
				_GameState.handleShot(new Projectile(_Ship.GunRotation,_Ship.GunX,_Ship.GunY));
				
			}

			_GameState.update();
			_GameState.CurrentProjectiles.render(context, _Ship, _GameState);
			
			if (_GameState.Enemies.count() < 2 && Math.random() <0.01)
			{
					var enemy = new Enemy(Math.floor(Math.random() * _GameState.CanvasWidth),Math.floor(Math.random() * _GameState.CanvasHeight));
					_GameState.Enemies.add(enemy);
			}
			
			_Ship.moveNext(_GameState.KeysPressed[0],_GameState.KeysPressed[1],_GameState.KeysPressed[2],_GameState.KeysPressed[3],_GameState.KeysPressed[5],_GameState.KeysPressed[6]);
			document.getElementById("info").innerHTML= _Ship.X.toString() + ", " + _Ship.Y.toString();
			document.getElementById("score").innerHTML="Score: " + _GameState.Score + " Shot: " + _GameState.ShotCount;	
		}

}



//Handles which keys are pressed and holds them in an array. 1 is down 0 is up
function changeKey(which, to){
	switch (which)
	{
		case 65:case 37: _GameState.KeysPressed[0]=to; break; // left
		case 38: _GameState.KeysPressed[2]=to; break; // up
		case 39: _GameState.KeysPressed[1]=to; break; // right
		case 40: _GameState.KeysPressed[3]=to; break;// down
		case 32: _GameState.KeysPressed[4]=to; break; // space bar;
		case 90: _GameState.KeysPressed[5]=to; break; //z key
		case 88: _GameState.KeysPressed[6]=to; break; //x key
		case 83: _GameState.KeysPressed[7]=to; break; //s key
	}
	
}


//Event Handlers
document.onkeydown=function(e){changeKey((e||window.event).keyCode, 1);}
document.onkeyup=function(e){changeKey((e||window.event).keyCode, 0);}




window.onload=function()
{
	var items = [
					{ identifier: "enemyImage", type:"image", src: "images/house.jpeg"},
					{ identifier: "backgroudSound",type:"audio", src: "sounds/background.mp3"},
					{ identifier: "bangSound",type:"audio", src: "sounds/bang.mp3"},
					{ identifier: "explosionSound",type:"audio", src: "sounds/explosion.mp3"},
					{ identifier: "laserSound",type:"audio", src: "sounds/laser.mp3"}
					
				];
	_Preloader = new Preloader(items);
	_Preloader.preloadComplete = startGame;
	_Preloader.progressChanged = updateProgress;
	_Preloader.preload();
}

function updateProgress(percentDone) {
	$("#progress").html(percentDone);
}

function startGame(success)
{
	$("#loader").hide();
	_Buffer = document.Crea
	_CanvasElement = document.getElementById('myCanvas');
	if (_CanvasElement && _CanvasElement.getContext) 
	{
		_Context = _CanvasElement.getContext('2d');
		if (_Context) 
		{
			
			
			_GameState = new GameState(_Context, _Preloader);
			_GameState.CanvasHeight = 400;
			_GameState.CanvasWidth = 600;
			_Ship = new Ship(_Context,600,400);
			setInterval(animate,10);
		}
	}
}


//Classes and objects below