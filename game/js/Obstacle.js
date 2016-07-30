var Obstacle = Class({
	constructor: function(x,y,spriteName) {
		this.sprite = gameState.game.add.sprite(x,y,spriteName);
		this.sprite.scale.set(4);
		this.sprite.anchor.set(0.5);
		this.sprite.smoothed = false;
		gameState.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.immovable = true;
		
		gameState.obstacles.push(this);
	}
});