var Projectiles = {};

////////////////////////////////////////
// Projectile
////////////////////////////////////////
var Projectile = Class({
	constructor: function(spriteName, animationSetName, speed, effect, maxDistance, maxLifetime, bounce) {
		this.spriteName = spriteName;
		this.animationSetName = animationSetName;
		this.speed = speed;
		this.effect = effect;
		this.sprite = null;
		this.isDirectional = false;
		this.sourceEntity = null;
		this.maxDistance = maxDistance;
		this.maxLifetime = (typeof maxLifetime !== 'undefined') ? maxLifetime : 1000;
		this.bounce = (typeof bounce !== 'undefined') ? bounce : 0.5;

		this.collidesWithEntities = true;
		this.collidesWithObstacles = true;
		this.removeOnCollideObstacle = false;
		this.removeOnCollideEntity = true;
		this.bounces = 1;

		this.startPoint = null;

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
		this.sprite.body.bounce.set(this.bounce);

		var velocity = new Phaser.Point(this.speed,0);
		velocity.rotate(0,0,direction);
		if (initialVelocity) velocity.add(initialVelocity.x, initialVelocity.y);

		this.sprite.body.velocity.set(velocity.x, velocity.y);

		this.startPoint = new Phaser.Point(x,y);
		this.startTime = gameState.currentTime;
	},

	update: function() {
		if (gameState.currentTime - this.startTime > this.maxLifetime || this.sprite.position.distance(this.startPoint) >= this.maxDistance) {
			this.remove = true;
		}
	},

	onCollideEntity: function(entity) {
		if (this.effect.type == "damage") {
			entity.takeDamage(this.effect.amount, this.sourceEntity);
		}

		if (this.removeOnCollideEntity) this.remove = true;
	},

	onCollideObstacle: function(obstacle) {
		if (this.removeOnCollideObstacle) this.remove = true;

		if (this.bounces == 0) this.remove = true;
		else this.bounces -= 1;
	},

	onRemove: function() {
		if (this.effect.type == "bomb") {
			var entities = gameState.getEntitiesNearPoint(this.sprite.position, this.effect.radius);
			var entity;
			var velocityEffect = this.effect.impact;
			var awayVector = new Phaser.Point(0,0);
			for (var i = 0; i < entities.length; i++) {
				entity = entities[i];
				Phaser.Point.subtract(entity.sprite.position, this.sprite.position, awayVector);
				awayVector.setMagnitude(velocityEffect);
				entity.sprite.body.velocity.add(awayVector.x, awayVector.y);
				entity.takeDamage(this.effect.amount, this.sourceEntity);
			}

			gameState.doBombEffect(this.sprite.position.x, this.sprite.position.y);
		}
	}
});

////////////////////////////////////////
// RotatedProjectile
////////////////////////////////////////
RotatedProjectile = Class(Projectile, {
	constructor: function(spriteName, speed, effect, maxDistance, maxLifetime, bounce) {
		RotatedProjectile.$super.call(this, spriteName, 'none', speed, effect, maxDistance, maxLifetime, bounce);
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
});

////////////////////////////////////////
// DragProjectile (projectile with drag)
////////////////////////////////////////
DragProjectile = Class(Projectile, {
	constructor: function(spriteName, animationSetName, speed, effect, maxDistance, maxLifetime, bounce, drag) {
		DragProjectile.$super.call(this, spriteName, animationSetName, speed, effect, maxDistance, maxLifetime, bounce);
		this.drag = drag;
	},

	init: function(x, y, direction, initialVelocity) {
		DragProjectile.$superp.init.call(this, x, y, direction, initialVelocity);
		this.sprite.body.drag.set(this.drag);
	}
});

////////////////////////////////////////
// Boomerang
////////////////////////////////////////
Projectiles.Boomerang = Class(Projectile, {
	constructor: function(speed, effect, maxDistance, maxLifetime) {
		Projectiles.Boomerang.$super.call(this, 'boomerang', 'rot4', speed, effect, maxDistance, maxLifetime);
		this.bounces = 1000; //FOREVER
	}
});

////////////////////////////////////////
// Arrow
////////////////////////////////////////
Projectiles.Arrow = Class(RotatedProjectile, {
	constructor: function(speed, effect, maxDistance, maxLifetime) {
		Projectiles.Arrow.$super.call(this, 'arrow', speed, effect, maxDistance, maxLifetime);
	}
})

////////////////////////////////////////
// Key
////////////////////////////////////////
Projectiles.Key = Class(RotatedProjectile, {
	constructor: function(speed, effect, maxDistance, maxLifetime) {
		Projectiles.Key.$super.call(this, 'key', speed, effect, maxDistance, maxLifetime);
	}
})

////////////////////////////////////////
// BOMB
////////////////////////////////////////
Projectiles.Bomb = Class(DragProjectile, {
	constructor: function(speed, effect, maxLifetime, drag) {
		Projectiles.Bomb.$super.call(this, 'bomb', 'idle8', speed, effect, 99999, maxLifetime, 0.5, drag);
		this.removeOnCollideEntity = false;
	}
})
