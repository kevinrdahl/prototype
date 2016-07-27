
BasicGame.Preloader = function (game) {

	this.loadingText = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		var text = this.add.text(this.game.width/2, this.game.height/2, "Loading...", {font:"32px Concert One", fill:"#ffffff", align:"center"});
		text.anchor.x = 0.5;
		text.anchor.y = 0.5;
		text.inputEnabled = true;
		text.clickAction = "play";

		this.loadingText = text;

		//	Here we load the rest of the assets our game needs.
		//	You can find all of these assets in the Phaser Examples repository
	   this.load.image('starfield', 'assets/skies/deep-space.jpg');

		/*this.load.spritesheet("player-down", "assets/sprites/notlinkdown.png", 16, 16, 4);
		this.load.spritesheet("player-up", "assets/sprites/notlinkup.png", 16, 16, 4);
		this.load.spritesheet("player-side", "assets/sprites/notlinkside.png", 16, 16, 4);*/
		this.load.spritesheet("notlink", "assets/sprites/notlink.png", 16, 16, 15);
		this.load.spritesheet("cloak", "assets/sprites/cloak.png", 16, 16, 12);
		this.load.spritesheet("feather", "assets/sprites/feather.png", 16, 16, 12);
		this.load.spritesheet("snake", "assets/sprites/hoodfang.png", 16, 16, 12);
	},

	create: function () {
		this.state.start('MainMenu');
	},

	resize: function (width, height) {

		//	If the game container is resized this function will be called automatically.
		//	You can use it to align sprites that should be fixed in place and other responsive display things.

	    this.bg.width = width;
	    this.bg.height = height;

		 this.resetTextPosition(this.playText);

	    /*this.spriteMiddle.x = this.game.world.centerX;
	    this.spriteMiddle.y = this.game.world.centerY;

	    this.spriteTopRight.x = this.game.width;
	    this.spriteBottomLeft.y = this.game.height;

	    this.spriteBottomRight.x = this.game.width;
	    this.spriteBottomRight.y = this.game.height;*/

	}

};
