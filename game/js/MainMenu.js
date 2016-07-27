
BasicGame.MainMenu = function (game) {

	this.bg;
	this.playText;
	this.downElement; //element which received the input down event (want it to be the same as up event, to click)

	/*this.spriteTopLeft;
	this.spriteTopRight;
	this.spriteBottomLeft;
	this.spriteBottomRight;*/

};

BasicGame.MainMenu.prototype = {

	create: function () {

	    this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');

		 var text = this.add.text(this.game.width/2, this.game.height/2, "PLAY", {font:"48px Concert One", fill:"#ffffff", align:"center"});
		 text.anchor.x = 0.5;
		 text.anchor.y = 0.5;
		 text.inputEnabled = true;
		 text.clickAction = "play";

		 text.events.onInputOver.add(this.textOver, this);
		 text.events.onInputOut.add(this.textOut, this);
		 text.events.onInputDown.add(this.textDown, this);
		 text.events.onInputUp.add(this.textUp, this);

		 this.playText = text;

	    /*this.spriteTopLeft = this.add.sprite(0, 0, 'tetris3');

	    this.spriteTopRight = this.add.sprite(this.game.width, 0, 'tetris1');
	    this.spriteTopRight.anchor.set(1, 0);

	    this.spriteBottomLeft = this.add.sprite(0, this.game.height, 'tetris2');
	    this.spriteBottomLeft.anchor.set(0, 1);

	    this.spriteBottomRight = this.add.sprite(this.game.width, this.game.height, 'tetris3');
	    this.spriteBottomRight.anchor.set(1, 1);

        this.spriteMiddle = this.add.sprite(0, 0, 'hotdog');*/

	},

	update: function () {

		//	Do some nice funky main menu effect here

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

	},

	textOver: function(text) {
		text.fill = "#ffff00";
	},

	textOut: function(text) {
		text.fill = "#ffffff";

		this.resetTextPosition(text);
	},

	textDown: function(text) {
		this.resetTextPosition(text);
		text.position.x += 5;
		text.position.y += 5;

		this.downElement = text;
	},

	textUp: function(text) {
		this.resetTextPosition(text);

		if (this.downElement == text) {
			var action = text.clickAction;
			if (action == "play") {
				this.state.start("Game");
			}
		}

		this.downElement = null;
	},

	resetTextPosition: function(text) {
		text.position.x = this.game.width/2;
		text.position.y = this.game.height/2;
	}

};
