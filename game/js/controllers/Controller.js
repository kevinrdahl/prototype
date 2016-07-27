var Controller  = Class({
   constructor: function() {
      this.direction = new Phaser.Point(0,0);
      this.speed = 0;
      this.facing = 0;
		this.useAbilities = {
			primary:false,
			secondary:false,
			movement:false
		};
   },

   update: function(gameState) {
      
   }
});
