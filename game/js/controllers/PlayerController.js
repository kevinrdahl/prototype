var PlayerController = Class(Controller, {
   constructor: function() {
      PlayerController.$super.call(this);
   },

   update: function(gameState) {
      this.direction.set(0,0);

      if (gameState.cursors.left.isDown) this.direction.x -= 1;
      if (gameState.cursors.right.isDown) this.direction.x += 1;
      if (gameState.cursors.up.isDown) this.direction.y -= 1;
      if (gameState.cursors.down.isDown) this.direction.y += 1;

      if (this.direction.getMagnitude > 0) this.direction.setMagnitude(1);
		
		this.facing = gameState.playerEntity.sprite.position.angle(gameState.mouseWorldPosition);
		this.useAbilities.primary = gameState.input.activePointer.isDown;
   }
})
