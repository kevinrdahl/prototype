
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
	 
	 this.enemiesKilledThisFrame = [];

    this.filters = {};
};

BasicGame.Game.prototype = {

	create: function () {
      console.log("CREATE GAME");
      this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); return false; }

		window.gameState = this;

		this.world.setBounds(-2000, -2000, 4000, 4000);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
         up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
         down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
         left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
         right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
      };

      this.filters['Glow'] = new GlowFilter(10,10,1,1,1,0xffffff,0.1);
		this.filters['PlayerGlow'] = new GlowFilter(10,10,1,0,0,0xffffff,0.1);

      this.physics.startSystem(Phaser.Physics.ARCADE);

      this.playerEntity = new Entity("notlink");
      this.playerEntity.init(50, 50);
		this.playerController = new PlayerController(this.playerEntity);
      this.playerEntity.controller = this.playerController;
		this.entities.push(this.playerEntity);
		this.controllers.push(this.playerController);
		this.playerEntity.sprite.filters = [this.filters['PlayerGlow']];
		this.playerEntity.sprite.tint = 0xff8888;

      for (var i = 0; i < 5; i++) {
         var entity = new Entity("cloak");
         entity.init(800, 50 + i*150);
         entity.controller = new SimpleEnemyController(entity);
   		this.controllers.push(entity.controller);
         this.entities.push(entity);
      }

		this.camera.follow(this.playerEntity.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	},

	update: function () {
      var currentTime = Date.now();
		this.updateTimeDelta = currentTime - this.currentTime;
		this.currentTime = currentTime;

		this.mousePosition.set(this.input.mousePointer.x, this.input.mousePointer.y);
		this.mouseWorldPosition.set(this.mousePosition.x + this.camera.position.x, this.mousePosition.y + this.camera.position.y);
		
		this.enemiesKilledThisFrame.splice(0, this.enemiesKilledThisFrame.length);

		this.updateControllers();
		this.updateMovement();
		this.updateActions();
		this.doCollisions();
      this.removeDead();
		this.checkChangePlayerType();
	},

	updateControllers: function() {
		for (var i = 0; i < this.controllers.length; i++) {
			this.controllers[i].update(this);
		}
	},

	updateMovement: function() {
		for (var i = 0; i < this.entities.length; i++) {
         this.entities[i].updateMovement(this);
      }

      for (var i = 0; i < this.projectiles.length; i++) {
         this.projectiles[i].update();
      }
	},

	updateActions: function() {
		for (var i = this.entities.length-1; i >= 0; i--) {
         this.entities[i].updateActions(this);
      }
	},

	doCollisions: function() {
		//entities with entities
		for (var i = this.entities.length-1; i >= 0; i--) {
			for (var j = i-1; j >= 0; j--) {
				if (this.game.physics.arcade.collide(this.entities[i].sprite, this.entities[j].sprite)) {
					this.onEntityEntityCollision(this.entities[i], this.entities[j]);
				}
			}
		}

		//entities with projectiles
		for (var i = this.entities.length-1; i >= 0; i--) {
			for (var j = this.projectiles.length-1; j >= 0; j--) {
				if (this.projectiles[j].sourceEntity == this.entities[i]) continue;

				if (this.game.physics.arcade.collide(this.entities[i].sprite, this.projectiles[j].sprite)) {
					this.onEntityProjectileCollision(this.entities[i], this.projectiles[j]);
				}
			}
		}
	},

   removeDead: function() {
      var projectile;
		for (var i = this.projectiles.length-1; i >= 0; i--) {
			projectile = this.projectiles[i];
			projectile.update(this);
			if (projectile.remove) {
				this.projectiles.splice(i,1);
				projectile.sprite.destroy();
			}
		}

      var entity;
		for (var i = this.entities.length-1; i >= 0; i--) {
			entity = this.entities[i];
			if (entity.remove) {
				this.removeEntity(entity, i);
			}
		}
   },

	onEntityEntityCollision: function(entity1, entity2) {

	},

	onEntityProjectileCollision: function(entity, projectile) {
      projectile.onCollide(entity);
	},

	addProjectile: function(projectile, x, y, facing, sourceEntity) {
		projectile.init(x, y, facing, sourceEntity.sprite.body.velocity);
		projectile.sourceEntity = sourceEntity;
		this.projectiles.push(projectile);
	},

   killEntity: function(entity, killingEntity) {
      var deathSprite = this.game.add.sprite(entity.sprite.position.x, entity.sprite.position.y, entity.sprite.key, entity.sprite.frame);
      deathSprite.scale.copyFrom(entity.sprite.scale);
      deathSprite.anchor.copyFrom(entity.sprite.anchor);

      deathSprite.filters = [this.filters['Glow']];

      var tween = this.game.add.tween(deathSprite).to({alpha:0}, 1000, "Quart.easeOut");
      tween.onComplete.add(function() {
         deathSprite.destroy();
      });
      tween.start();

      entity.remove = true;
		entity.alive = false;
		
		if (killingEntity == this.playerEntity && killingEntity.alive) {
			this.enemiesKilledThisFrame.push(entity);
		}
		
		if (entity == this.playerEntity) {
			this.camera.unfollow();
		}
   },

   removeEntity: function(entity, index) {
      index = (typeof index !== 'undefined') ? index : this.entities.indexOf(entity);
      
      entity.sprite.destroy();
      entity.group.destroy();
      if (entity.controller) this.controllers.splice(this.controllers.indexOf(entity.controller),1);
      this.entities.splice(index, 1);
   },
	
	checkChangePlayerType: function() {
		if (this.enemiesKilledThisFrame.length == 0) return;
		
		//pick a random killed entity
		var index = Math.floor(Math.random() * this.enemiesKilledThisFrame.length);
		var entity = this.enemiesKilledThisFrame[index];
		
		if (this.playerEntity.type != entity.type) {
			console.log("Change to " + entity.type);
			
			this.playerEntity.setType(entity.type);
			
			var filter = this.filters['PlayerGlow'];
			filter.uniforms.innerStrength.value = 1;
			var tween = this.game.add.tween(filter.uniforms.innerStrength).to({value:0}, 1000, "Quart.easeOut");
			tween.start();
		}
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
