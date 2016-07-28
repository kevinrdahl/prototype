var Abilities = {};

Ability = Class({
	constructor: function(entity, cooldown) {
		this.entity = entity;
		this.cooldown = cooldown;
		
		this.currentCooldown = 0;
		this.active = false;
	},
	
	update: function() {
		if (this.currentCooldown > 0) {
			this.currentCooldown = Math.max(0, this.currentCooldown - gameState.updateTimeDelta);
		}
	},
	
	activate: function() {
		if (this.currentCooldown > 0) return;
		this.currentCooldown = this.cooldown;
		this.doEffect();
	},
	
	doEffect: function() {
		console.log("Worthless ability!");
	}
});

Abilities.boomerang = Class(Ability, {
	constructor: function(entity) {
		Abilities.boomerang.$super.call(this, entity, 500);
	},
	
	doEffect: function() {
		//var projectile = new Projectile('boomerang', 'rot4', 750, {type:'damage', amount:1}, 750, 3000);
		var projectile = new Projectiles.Boomerang(750, {type:'damage', amount:2}, 750, 2000);
		fireProjectileToFacing(this.entity, projectile, this.entity.controller.facing);
	}
});

Abilities.arrow = Class(Ability, {
	constructor: function(entity) {
		Abilities.arrow.$super.call(this, entity, 750);
	},
	
	doEffect: function() {
		var projectile = new Projectiles.Arrow(1000, {type:'damage', amount:3}, 1000, 2000);
		fireProjectileToFacing(this.entity, projectile, this.entity.controller.facing);
	}
});

Abilities.fireKey = Class(Ability, {
	constructor: function(entity) {
		Abilities.arrow.$super.call(this, entity, 300);
	},
	
	doEffect: function() {
		var projectile = new Projectiles.Key(800, {type:'damage', amount:1}, 800, 2000);
		fireProjectileToFacing(this.entity, projectile, this.entity.controller.facing, Phaser.Math.degToRad(15));
	}
});

function fireProjectileToFacing(entity, projectile, facing, spread) {
	if (spread) facing += Utils.vary(spread);
	var origin = new Phaser.Point(Math.abs(entity.sprite.width),0);
	origin.rotate(0, 0, facing);
	origin.add(entity.sprite.position.x, entity.sprite.position.y);
	
	gameState.addProjectile(projectile, origin.x, origin.y, facing, entity);
}