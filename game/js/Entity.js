var Entity = Class({
	constructor: function(type) {
	   this.type = type;
		
		this.group = null;
	   this.sprite = null;
	   this.controller = null;
	   this.speed = 400;
	   this.acceleration = 100;
	   this.direction = 'down';
	   this.animationSet = null;
		this.hp = 5;
		this.maxHp = 5;
		this.abilities = {
			primary:null,
			secondary:null,
			movement:null
		};
		
		this.healthBar = new HealthBar(5,5);
	},
	
	init: function(x, y) {
		this.group = gameState.game.add.group();
		this.group.x = x;
		this.group.y = y;
		
		this.setType(this.type);
		this.sprite.position.set(x,y);
		this.healthBar.init(this);
	},
	
	updateMovement: function() {
		if (!this.controller) return;
	
	   this.controller.update(gameState);
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
	
	setAnimation: function(animation, direction) {
		if (typeof direction !== "undefined") this.direction = direction;
	   else direction = this.direction;
	
	   AnimationSets.setObjectAnimation(this, animation, direction);
	},
	
	setType: function(type) {
		var x = 0;
		var y = 0;
		
		if (this.sprite) {
			x = this.sprite.position.x;
			y = this.sprite.position.y;
			this.sprite.destroy();
		}
		
		var typeDef = EntityTypes[this.type];
		if (!typeDef) {
			console.error("no Entity type '" + this.type + "'");
			return;
		}
		
		this.sprite = gameState.game.add.sprite(x, y, typeDef.sprite);
		AnimationSets.applyToObject(this, AnimationSets[typeDef.animationSet]);
      this.setAnimation('idle', 'down');
      this.sprite.scale.set(4);
      this.sprite.smoothed = false;
      this.sprite.anchor.set(0.5,0.5);
		
		for (var type in typeDef.abilities) {
			var abilityType = Abilities[typeDef.abilities[type]];
			if (abilityType) {
				this.abilities[type] = new abilityType(this);
			}
		}

      gameState.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	}
});