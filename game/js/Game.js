
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
	 this.controllers = [];
    this.entities = [];
    this.obstacles = [];
	 this.projectiles = [];
    this.cursors;
    this.currentTime = Date.now();
	 this.updateTimeDelta = 0;
	 this.mousePosition = new Phaser.Point(0,0);
	 this.mouseWorldPosition = new Phaser.Point(0,0);
};

BasicGame.Game.prototype = {

	create: function () {
      console.log("CREATE GAME");
		window.gameState = this;
		
		this.world.setBounds(-2000, -2000, 4000, 4000);

      this.cursors = this.input.keyboard.createCursorKeys();

      this.physics.startSystem(Phaser.Physics.ARCADE);

      this.playerController = new PlayerController();

      this.playerEntity = new Entity("notlink");
      this.playerEntity.init(this, 50, 50);
      this.playerEntity.controller = this.playerController;
		this.entities.push(this.playerEntity);
		this.controllers.push(this.playerController);

      var entity = new Entity("cloak");
      entity.init(this, 250, 250);
      entity.controller = new Controller(this);
		this.controllers.push(entity.controller);
      this.entities.push(entity);
		
		this.camera.follow(this.playerEntity.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	},

	update: function () {
      var currentTime = Date.now();
		this.updateTimeDelta = currentTime - this.currentTime;
		this.currentTime = currentTime;
		
		this.mousePosition.set(this.input.mousePointer.x, this.input.mousePointer.y);
		this.mouseWorldPosition.set(this.mousePosition.x + this.camera.position.x, this.mousePosition.y + this.camera.position.y);
		
		this.updateControllers();
		this.updateMovement();
		this.updateProjectiles();
		this.updateActions();
		this.doCollisions();
	},
	
	updateControllers: function() {
		for (var i = 0; i < this.controllers.lengthl; i++) {
			this.controllers[i].update(this);
		}
	},
	
	updateMovement: function() {
		for (var i = 0; i < this.entities.length; i++) {
         this.entities[i].updateMovement(this);
      }
	},
	
	updateProjectiles: function() {
		var projectile;
		for (var i = this.projectiles.length-1; i >= 0; i--) {
			projectile = this.projectiles[i];
			projectile.update(this);
			if (projectile.remove) {
				this.projectiles.splice(i,1);
				projectile.sprite.destroy();
			}
		}
	},
	
	updateActions: function() {
		for (var i = 0; i < this.entities.length; i++) {
         this.entities[i].updateActions(this);
      }
	},
	
	doCollisions: function() {
		//entities with entities
		for (var i = 0; i < this.entities.length; i++) {
			for (var j = i+1; j < this.entities.length; j++) {
				if (this.game.physics.arcade.collide(this.entities[i].sprite, this.entities[j].sprite)) {
					this.onEntityEntityCollision(this.entities[i], this.entities[j]);
				}
			}
		}
		
		//entities with projectiles
		for (var i = 0; i < this.entities.length; i++) {
			for (var j = 0; j < this.projectiles.length; j++) {
				if (this.projectiles[j].sourceEntity == this.entities[i]) continue;
				
				if (this.game.physics.arcade.collide(this.entities[i].sprite, this.projectiles[j].sprite)) {
					this.onEntityProjectileCollision(this.entities[i], this.projectiles[j]);
					this.projectiles[j].remove = true;
				}
			}
		}
	},
	
	onEntityEntityCollision: function(entity1, entity2) {
		
	},
	
	onEntityProjectileCollision: function(entity, projectile) {
		
	},
	
	addProjectile: function(projectile, x, y, facing, sourceEntity) {
		projectile.init(this, x, y, facing, sourceEntity.sprite.body.velocity);
		projectile.sourceEntity = sourceEntity;
		this.projectiles.push(projectile);
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
