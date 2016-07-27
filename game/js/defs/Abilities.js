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
})

Abilities.boomerang = Class(Ability, {
	constructor: function(entity) {
		Abilities.boomerang.$super.call(this, entity, 250);
	},
	
	doEffect: function() {
		var projectile = new Projectile('boomerang', 'rot4', 750, {type:'damage', amount:1}, 750, 3000);
		var origin = new Phaser.Point(Math.abs(this.entity.sprite.width),0);
		origin.rotate(0, 0, this.entity.controller.facing);
		origin.add(this.entity.sprite.position.x, this.entity.sprite.position.y);
		
		gameState.addProjectile(projectile, origin.x, origin.y, this.entity.controller.facing, this.entity);
	}
})