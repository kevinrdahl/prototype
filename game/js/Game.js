
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.playerEntity = null;
    this.playerController = null;
    this.entities = [];
    this.obstacles = [];
    this.cursors;
    this.currentFrame = 0;
};

BasicGame.Game.prototype = {

	create: function () {
      console.log("CREATE GAME");

      this.cursors = this.input.keyboard.createCursorKeys();

      this.physics.startSystem(Phaser.Physics.ARCADE);

      this.playerController = new PlayerController();

      this.playerEntity = new Entity("player");
      this.playerEntity.init(this.game);
      this.playerEntity.controller = this.playerController;

      var entity = new Entity("cloak");
      entity.init(this.game);
      entity.sprite.position.x = 200;
      entity.controller = this.playerController;
      this.entities.push(entity);

      console.log(this.entities);
	},

	update: function () {
      this.currentFrame += 1;
      //console.log("=== FRAME " + this.currentFrame + " ===");

      this.playerController.update(this);
      this.playerEntity.update(this);

      for (var i = 0; i < this.entities.length; i++) {
         this.entities[i].update(this);
      }
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
