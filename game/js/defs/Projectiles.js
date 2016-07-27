var Projectiles = {};

var Projectile = Class({
	constructor: function(spriteName, animationSetName, speed, effect, maxDistance, maxLifetime) {
		this.spriteName = spriteName;
		this.animationSetName = animationSetName;
		this.speed = speed;
		this.effect = effect;
		this.sprite = null;
		this.isDirectional = false;
		this.sourceEntity = null;
		this.maxDistance = maxDistance;
		this.maxLifetime = maxLifetime;
		
		this.startPoint = null;
		this.startTime = gameState.currentTime;
		
		this.remove = false;
	},
	
	init: function(gameState, x, y, direction, initialVelocity) {
		this.sprite = gameState.add.sprite(x, y, this.spriteName);
		if (this.animationSetName) {
			AnimationSets.applyToObject(this, AnimationSets[this.animationSetName]);
			AnimationSets.setObjectAnimation(this, 'idle', 'down', true);
		}
		this.sprite.scale.set(4);
		this.sprite.smoothed = false;
		this.sprite.anchor.set(0.5,0.5);
		
		gameState.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.setSize(10,10,3,3);
		
		var velocity = new Phaser.Point(this.speed,0);
		velocity.rotate(0,0,direction);
		if (initialVelocity) velocity.add(initialVelocity.x, initialVelocity.y);
		
		this.sprite.body.velocity.set(velocity.x, velocity.y);
		
		this.startPoint = new Phaser.Point(x,y);
	},
	
	update: function(gameState) {
		if (gameState.currentTime - this.startTime > this.maxLifetime || this.sprite.position.distance(this.startPoint) >= this.maxDistance) {
			this.remove = true;
		}
	},
	
	onCollide: function(entity) {
		if (this.effect.type == "damage") {
			entity.takeDamage(this.effect.amount);
		}
	}
});


/*Projectiles.Boomerang = Class(Projectile, {
	constructor: function()
});*/

//Projectiles['boomerang'] = new Projectiles.Projectile('boomerang', 500, {type:'damage', amount:1});