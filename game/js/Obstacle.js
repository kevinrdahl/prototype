var Obstacle = Class({
	constructor: function(spriteName) {
		this.sprite = null;
		this.spriteName = spriteName;
	},
	
	init: function(x,y) {
		this.sprite = gameState.game.add.sprite(x,y,this.spriteName);
		this.sprite.scale.set(4);
		this.sprite.anchor.set(0.5);
		this.sprite.smoothed = false;
		gameState.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	}
});