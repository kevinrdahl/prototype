var Entity = Class({
	constructor: function(type) {
	   this.type = type;

	   this.sprite = null;
      this.group = null;
	   this.controller = null;
	   this.speed = 400;
	   this.acceleration = 100;
	   this.direction = 'down';
	   this.animationSet = null;
		this.hp = -1;
		this.maxHp = -1;
		this.alive = true;
		this.abilities = {
			primary:null,
			secondary:null,
			movement:null
		};

		this.healthBar = null;
      this.remove = false;
	},

	init: function(x, y) {
		this.setType(this.type);
		this.sprite.position.set(x,y);
      this.group = gameState.game.add.group();

      this.healthBar = new HealthBar();
		this.healthBar.init(this);
	},

	updateMovement: function() {
		if (!this.controller) return;

	   var body = this.sprite.body;

	   var acceleration = this.controller.direction.clone();
	   acceleration.multiply(this.acceleration, this.acceleration);

	   if (acceleration.getMagnitude() == 0) {
	      var currentMagnitude = body.velocity.getMagnitude();
	      body.velocity.setMagnitude(Math.max(0, currentMagnitude - this.acceleration));

	      this.setAnimation("idle");
	   } else {
	      Phaser.Point.add(body.velocity, acceleration, body.velocity);
	      body.velocity.setMagnitude(Math.min(this.speed, body.velocity.getMagnitude()));

	      if (Math.abs(acceleration.x) >= Math.abs(acceleration.y)) {
	         if (acceleration.x > 0) this.setAnimation("walk", "right");
	         else this.setAnimation("walk", "left");
	      } else if (Math.abs(acceleration.x) < Math.abs(acceleration.y)) {
	         if (acceleration.y > 0) this.setAnimation("walk", "down");
	         else this.setAnimation("walk", "up");
	      }
	   }

      this.group.position.set(this.sprite.position.x, this.sprite.position.y);
	},

	updateActions: function() {
		var ability;
		for (var type in this.abilities) {
			ability = this.abilities[type];
			if (ability) ability.update();
		}

		if (this.controller.useAbilities.primary) {
			this.abilities.primary.activate();
		}
	},

   takeDamage: function(amount, source) {
      this.hp = Math.max(0, this.hp - amount);
      this.healthBar.update();

      if (this.hp == 0) gameState.killEntity(this, source);
   },

	setAnimation: function(animation, direction, force) {
		if (typeof direction !== "undefined") this.direction = direction;
	   else direction = this.direction;

	   AnimationSets.setObjectAnimation(this, animation, direction, force);
	},

	setType: function(type) {
		var typeDef = EntityTypes[type];
		var setAnim = false;
		if (!typeDef) {
			console.error("no Entity type '" + this.type + "'");
			return;
		}
		
		this.type = type;

      this.maxHp = typeDef.hp;
      if (this.hp == -1) this.hp = typeDef.hp;

      if (this.sprite) {
			var anim = this.sprite.animations.currentAnim.name;
			var frame = this.sprite.animations.currentFrame.index;
			this.sprite.loadTexture(typeDef.sprite);
			this.sprite.animations.play(anim);
			//this.sprite.animations.currentAnim.frame = frame;
         //this.sprite.body.setSize(this.sprite.width, this.sprite.height);
		} else {
			setAnim = true;
         this.sprite = gameState.game.add.sprite(0,0,typeDef.sprite);
         this.sprite.scale.set(4);
         this.sprite.smoothed = false;
         this.sprite.anchor.set(0.5);
         gameState.physics.enable(this.sprite, Phaser.Physics.ARCADE);
      }

      AnimationSets.applyToObject(this, AnimationSets[typeDef.animationSet]);
      if (setAnim) this.setAnimation('idle', 'down', true);

		for (var type in typeDef.abilities) {
			var abilityType = Abilities[typeDef.abilities[type]];
			if (abilityType) {
				this.abilities[type] = new abilityType(this);
			}
		}
	}
});
