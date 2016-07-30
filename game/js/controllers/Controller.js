var Controller  = Class({
   constructor: function(entity) {
		this.entity = entity;
      this.direction = new Phaser.Point(0,0);
      this.speed = 0;
      this.facing = 0;
		this.useAbilities = {
			primary:false,
			secondary:false,
			movement:false
		};
   },

   update: function() {
      for (type in this.useAbilities) {
			this.useAbilities[type] = false;
		}
   },
	
	aimAtTarget: function(entity, spread) {
		spread = (typeof spread !== 'undefined') ? spread : 0;
		this.facing = this.entity.sprite.position.angle(entity.sprite.position);
		if (spread > 0) this.facing += Utils.vary(spread);
	},
	
	moveToPoint: function(point, tolerance) {
		tolerance = (typeof tolerance !== 'undefined') ? tolerance : 10; //doesn't do anything yet!
		
		Phaser.Point.subtract(point, this.entity.sprite.position, this.direction);
		this.direction.setMagnitude(1);
	},
	
	moveAwayFromPoint: function(point) {
		Phaser.Point.subtract(this.entity.sprite.position, point, this.direction);
		this.direction.setMagnitude(1);
	},
	
	onTakeDamage: function(amount, sourceEntity) {

	}
});
