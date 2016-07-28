var PlayerController = Class(Controller, {
   constructor: function(entity) {
      PlayerController.$super.call(this, entity);
   },

   update: function() {
      this.direction.set(0,0);

      if (gameState.cursors.left.isDown || gameState.wasd.left.isDown) this.direction.x -= 1;
      if (gameState.cursors.right.isDown || gameState.wasd.right.isDown) this.direction.x += 1;
      if (gameState.cursors.up.isDown || gameState.wasd.up.isDown) this.direction.y -= 1;
      if (gameState.cursors.down.isDown || gameState.wasd.down.isDown) this.direction.y += 1;

      if (this.direction.getMagnitude > 0) this.direction.setMagnitude(1);

		this.facing = this.entity.sprite.position.angle(gameState.mouseWorldPosition);
		this.useAbilities.primary = gameState.input.activePointer.leftButton.isDown;
		this.useAbilities.secondary = gameState.input.activePointer.rightButton.isDown;
		this.useAbilities.movement = gameState.input.keyboard.isDown(Phaser.Keyboard.SPACE);
   }
})
