var HealthBar = Class({
	constructor: function() {
		this.group = new Phaser.Group(gameState.game);
		this.icons = [];
		this.entity = null;
	},

	init: function(entity) {
		this.entity = entity;
		entity.group.addChild(this.group);
		this.update();
	},

	update: function() {
		var icon;
		var value = this.entity.hp;
		var maxValue = this.entity.maxHp;

		//if for some reason there are too many, remove
		while(this.icons.length > maxValue) {
			icon = this.icons.pop();
			icon.destroy();
		}

		//Make em if they aren't there
		while(this.icons.length < maxValue) {
			icon = this.group.create(0,0,'gem_grey');
			//icon.scale.set(2);
			icon.smoothed = false;
			this.icons.push(icon);
		}

		var startX = (this.icons[0].width * Math.min(10, maxValue)) / -2;
		var y = this.entity.sprite.height/2 + 5;

		//TODO: rows
		for (var i = 0; i < this.icons.length; i++) {
			icon = this.icons[i];
			if (i % 10 == 0 && i > 0) y += icon.height;
			
			icon.position.x = startX + icon.width*(i%10);
			icon.position.y = y;

			if (value > i) {
				icon.loadTexture('gem_green');
			} else {
				icon.loadTexture('gem_grey');
			}
		}
	}
});
