Entity = function(type) {
   this.game = null;
   this.type = type;
   this.sprite = null;
   this.controller = null;
   this.speed = 400;
   this.acceleration = 100;
   this.direction = 'down';
   this.animationSet = null;
}

Entity.prototype.init = function(game) {
   this.game = game;

   if (this.type == "player") {
      this.sprite = this.game.add.sprite(50, 50, 'notlink');
      AnimationSets.applyToEntity(this, AnimationSets['up4_side4_down4']);
   } else if (this.type == "cloak") {
      this.sprite = this.game.add.sprite(50, 50, 'cloak');
      AnimationSets.applyToEntity(this, AnimationSets['up4_side4_down4']);
   } else if (this.type == "feather") {
      this.sprite = this.game.add.sprite(50, 50, 'feather');
      AnimationSets.applyToEntity(this, AnimationSets['up4_side4_down4']);
   } else if (this.type == "snake") {
      this.sprite = this.game.add.sprite(50, 50, 'snake');
      AnimationSets.applyToEntity(this, AnimationSets['up4_side4_down4']);
   }

   if (this.sprite) {
      this.setAnimation('idle', 'down');
      this.sprite.scale.set(4);
      this.sprite.smoothed = false;
      this.sprite.anchor.set(0.5,0.5);

      this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
   }
}

Entity.prototype.update = function(gameState) {
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
}

Entity.prototype.setAnimation = function(animation, direction) {
   if (typeof direction !== "undefined") this.direction = direction;
   else direction = this.direction;

   var animDef = this.animationSet[animation];
   if (!animDef || !animDef.directions) return;

   var dirDef = animDef.directions[direction];
   if (!dirDef) {
      direction = animDef.defaultDirection;
      dirDef = animDef.directions[direction];
      if (!dirDef) return;
   }

   var animName = animation + "_" + direction;

   if (this.sprite.animations.currentAnim.name != animName) {
      this.sprite.animations.play(animName);
   }

   if (dirDef.flipX) this.sprite.scale.x = -4;
   else this.sprite.scale.x = 4;

   if (dirDef.flipY) this.sprite.scale.y = -4;
   else this.sprite.scale.y = 4;
}
