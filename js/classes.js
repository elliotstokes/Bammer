function GameState(context, preloader)
{
	//private
	var _Context = context;
	var	_ShootDelay=400;
	var _CanShoot=true;
	var _ShootAudioHandle;
	var _PreLoader = preloader;
	//public
	this.KeysPressed=[0,0,0,0,0,0,0,0];// left, right, up, down, space, z, x, s
	this.CanvasHeight=0;
	this.CanvasWidth=0;
	this.Score=0;
	this.ShotCount=0;
	this.Started = false;
	this.DamageLimit = 10;
	this.CurrentProjectiles = new Projectiles();
	this.Enemies = new Enemies(_Context,this);
	
	this.playSound = function(id) {
		_PreLoader.getItem(id).currentTime = 0;
		_PreLoader.getItem(id).play();
	}
	
	this.handleShot = function(projectile)
	{
		if (_CanShoot==true)
		{
			this.CurrentProjectiles.add(projectile);
			this.playSound("bangSound");
			_CanShoot=false;
		}
	}
	
	this.update = function()
	{
		if (_CanShoot == false)
		{
			_ShootDelay -=20;
			if (_ShootDelay<=0)
			{
				_CanShoot=true;
				_ShootDelay=400;
			}
		}
	}
	
	this.reset = function()
	{
		//reset back for next game
		this.Score=0;
		this.ShotCount=0;
		this.CurrentProjectiles = new Projectiles();
		this.Enemies = new Enemies(_Context,this);
		this.Started = false;
	}

}

function Enemies(context,gamestate)
{
	var _Context = context;
	var _GameState = gamestate;
	var _Enemies = new Array();
	
	this.add = function(enemy)
	{
		_Enemies[_Enemies.length] = enemy;
	}
	
	this.render = function()
	{
		for(var i=_Enemies.length-1; i>=0;i--)
		{
			_Enemies[i].render(_Context, _GameState);
		}
	}
	
	this.hitTest = function(x,y)
	{
		var hasHit = false;
		for(var i=_Enemies.length-1; i>=0;i--)
		{
			if (_Enemies[i].hitTest(x,y))
			{
				_Enemies.splice(i,1);
				hasHit = true;
				break;
			}
		}
		return hasHit;
	}
	
	this.count = function()
	{
		return _Enemies.length;
	}
}

function Enemy(x,y)
{
	this.X = x;
	this.Y = y;
	var _HouseImage = new Image();
	_HouseImage.src = "images/house.jpeg";
	
	this.hitTest = function(x,y)
	{
		if (x > this.X && x < this.X + 32 && y > this.Y && y < this.Y + 32)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	this.render = function(context, gameState)
	{
		context.drawImage(_HouseImage, this.X, this.Y,32,32);
		
		if ( Math.random() > 0.989)
		{
			var projectile = new Projectile(Math.random() * (2* Math.PI), this.X, this.Y)
			projectile.EnemyShot = true;
			gameState.CurrentProjectiles.add(projectile);
			gameState.playSound("laserSound");
		}
		
	}
}

function Projectiles()
{
	var _Projectiles= new Array();
	
	this.add = function(projectile)
	{
		_Projectiles[_Projectiles.length] = projectile;
	}
	
	this.removeAt = function(itemIndex)
	{
		_Projectiles.splice(itemIndex ,1);
	}
	
	this.render = function(context,ship,gameState)
	{
		for(var i=_Projectiles.length-1; i>=0;i--)
		{
			var isRemoved = false;
			//draw to screen
			_Projectiles[i].render(context);
			_Projectiles[i].moveNext();
		
			//if one of mine
			if (_Projectiles[i].EnemyShot == false)
			{
				if (gameState.Enemies.hitTest(_Projectiles[i].CurrentX + _Projectiles[i].ShotX,_Projectiles[i].CurrentY + _Projectiles[i].ShotY))
				{
					_Projectiles.splice(i,1);
					gameState.Score++;
					gameState.playSound("explosionSound");
					isRemoved=true;
					break;
				}
			}
			else
			{
				if (ship.hitTest(_Projectiles[i].CurrentX + _Projectiles[i].ShotX,_Projectiles[i].CurrentY + _Projectiles[i].ShotY))
				{
					_Projectiles.splice(i,1);
					gameState.ShotCount++;
					gameState.playSound("explosionSound");
					isRemoved=true;
				}
			
			}
		
			if (!isRemoved)
			{
				if (_Projectiles[i].CurrentX>gameState.CanvasWidth || _Projectiles[i].CurrentY>gameState.CanvasHeight || _Projectiles[i].CurrentX + _Projectiles[i].ShotX <0 || _Projectiles[i].CurrentY + _Projectiles[i].ShotY <0)
				{
					_Projectiles.splice(i,1);
				}
			}
		}
	
	}
	
	this.getCount = function()
	{
		return _Projectiles.length;
	}
}

function Projectile(angle,shotX,shotY)
{
	//private
	var _Angle=angle;
	//public
	this.ShotX=shotX;
	this.ShotY=shotY;
	this.CurrentX=0;
	this.EnemyShot=false;
	this.CurrentY=0;
	this.Speed = 5;
	this.render = function(context)
	{
		context.save();
		context.translate(this.ShotX,this.ShotY);
		context.beginPath();
		if (this.EnemyShot)
		{
			context.fillStyle = 'rgb(200,50,12)';
		}
		else
		{
			context.fillStyle = 'rgb(0,0,0)';
		}
		context.arc(this.CurrentX,this.CurrentY,5,0,Math.PI * 2, false);
		context.fill();
		context.restore();
	}
	
	this.moveNext = function()
	{
		this.CurrentX += Math.cos(_Angle) * this.Speed;
		this.CurrentY += Math.sin(_Angle) * this.Speed;
	}
}

function Ship(context,canvasWidth,canvasHeight)
{
	var _Context = context;
	this.X=100;
	this.Y=100;
	this.GunX =0;
	this.GunY =0;
	this.CanvasHeight=canvasHeight;
	this.CanvasWidth=canvasWidth;
	this.ShipImage = new Image();
	this.ShipImage.src = "images/sprite.jpeg";
	this.GunRotation=0;
	this.ShipRotation=0;
	this.render = function()
	{
		_Context.save();
		_Context.translate(this.X,this.Y);
		var radgrad = context.createRadialGradient(0,0,66,0,0,76);
  		radgrad.addColorStop(0, '#FFCC00');
  		radgrad.addColorStop(Math.random(), '#FFFF00');
  		radgrad.addColorStop(1, 'rgba(255,255,255,0)');
  			
  		_Context.beginPath();
  		_Context.fillStyle = radgrad;
  		_Context.arc(0, 0, 76, 0, 2* Math.PI, false);
  		_Context.fill();
  		_Context.globalCompositeOperation = 'destination-out';
		_Context.beginPath();
		_Context.arc(0,0,60,0,Math.PI * 2, false);
		_Context.fill();
		_Context.restore();
	
		_Context.save();
		_Context.fillStyle = 'rgb(0,0,0)';
		_Context.translate(this.X,this.Y);
		//draw some circles	
		_Context.beginPath();
		_Context.arc(0,0,60,0,Math.PI * 2, false);
		_Context.fill();
		_Context.globalCompositeOperation = 'destination-out';
		_Context.beginPath();
		_Context.arc(0,0,55,0,Math.PI * 2, false);
		_Context.fill();

		_Context.restore();
		_Context.save();
		_Context.fillStyle = 'rgb(0,0,0)';
		_Context.translate(this.X,this.Y);
		_Context.rotate(this.GunRotation);
		_Context.fillRect(59,-10,25,20);
		_Context.restore();
		
		_Context.save();

		_Context.translate(this.X,this.Y);
		_Context.rotate(this.ShipRotation);

		//draw my image
		_Context.drawImage(this.ShipImage, -35, -35,70,70);
			
		_Context.restore();
	}
	
	this.hitTest = function(x,y)
	{
		if (x > this.X-60 && x < this.X + 60 && y > this.Y-60 && y < this.Y + 60)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	this.moveNext = function(left,right,up,down,rotateRight, rotateLeft)
	{
		//Update rotation amount in radians
		this.ShipRotation+=0.1;
		//If rotate is at max set back to 0
		if (this.ShipRotation > 2*Math.PI)
		{
			this.ShipRotation=0;
		}
	
	
		//Now adjust the transform based on the key movements
		if (left)
		{
			if (this.X - 65 >0)
			{
				this.X -= 2;
			}
		}
	
		if (right)
		{
			if (this.X + 65 < this.CanvasWidth)
			{
				this.X += 2;
			}
		}
	
		if (up)
		{
			if (this.Y - 65 >0)
			{
				this.Y -=2;
			}
		}
	
		if (down)
		{
			if (this.Y + 65 < this.CanvasHeight)
			{
				this.Y +=2;
			}
		}
	
		if (rotateRight)
		{
			this.GunRotation-=0.1;
		}
	
		if (rotateLeft)
		{
			this.GunRotation+=0.1;
		}
		
		this.GunX = 65 * Math.cos(this.GunRotation) + this.X;
		this.GunY =65 * Math.sin(this.GunRotation) + this.Y;
	}
}