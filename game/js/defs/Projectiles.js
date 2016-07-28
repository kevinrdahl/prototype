var Projectiles = {};

////////////////////////////////////////
// Projectile
////////////////////////////////////////
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

	init: function(x, y, direction, initialVelocity) {
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

	update: function() {
		if (gameState.currentTime - this.startTime > this.maxLifetime || this.sprite.position.distance(this.startPoint) >= this.maxDistance) {
			this.remove = true;
		}
	},

	onCollide: function(entity) {
		if (this.effect.type == "damage") {
			entity.takeDamage(this.effect.amount, this.sourceEntity);
		}

		this.remove = true;
	}
});

////////////////////////////////////////
// RotatedProjectile
////////////////////////////////////////
RotatedProjectile = Class(Projectile, {
	constructor: function(spriteName, speed, effect, maxDistance, maxLifetime) {
		RotatedProjectile.$super.call(this, spriteName, 'none', speed, effect, maxDistance, maxLifetime);
		//this.rounding = 1;
	},
	
	init: function(x, y, direction, initialVelocity) {
		RotatedProjectile.$superp.init.call(this, x, y, direction, initialVelocity);
		this.rotate();
	},
	
	update: function() {
		RotatedProjectile.$superp.update.call(this);
		this.rotate();
	},
	
	rotate: function() {
		//face the right way!
		var zero = new Phaser.Point(0,0);
		var facing = zero.angle(this.sprite.body.velocity);
		this.sprite.rotation = facing;
	}
})

////////////////////////////////////////
// Boomerang
////////////////////////////////////////
Projectiles.Boomerang = Class(Projectile, {
	constructor: function(speed, effect, maxDistance, maxLifetime) {
		Projectiles.Boomerang.$super.call(this, 'boomerang', 'rot4', speed, effect, maxDistance, maxLifetime);
	}
});

////////////////////////////////////////
// Arrow
////////////////////////////////////////
Projectiles.Arrow = Class(RotatedProjectile, {
	constructor: function(speed, effect, maxDistance, maxLifetime) {
		Projectiles.Arrow.$super.call(this, 'arrow', speed, effect, maxDistance. maxLifetime);
	}
})

////////////////////////////////////////
// Key
////////////////////////////////////////
Projectiles.Key = Class(RotatedProjectile, {
	constructor: function(speed, effect, maxDistance, maxLifetime) {
		Projectiles.Arrow.$super.call(this, 'key', speed, effect, maxDistance. maxLifetime);
	}
})