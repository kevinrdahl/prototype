var HealthBar = Class({
	constructor: function() {
		this.group = new Phaser.Group(gameState.game);
		this.icons = [];
		this.maxValue = 1;
		this.value = 1;
		this.entity = null;
	},
	
	init: function(entity) {
		this.entity = entity;
		this.value = entity.hp;
		this.maxValue = entity.maxHp;
		
		//TODO: entities need to have a group
	},
	
	setIcons: function() {
		var icon;
		
		//Make em if they aren't there
		while(this.icons.length < this.maxValue) {
			icon = this.group.create(0,0,'gem_grey');
			icon.scale.set(4);
			icon.smoothed = false;
			this.icons.push(icon);
		}
		
		for (var i = 0; i < this.icons.length; i++) {
			icon = icons[i];
			icon.position.x = icon.width*i;
			
			if (this.value > i) {
				icon.loadTexture('gem_green');
			} else {
				icon.loadTexture('gem_grey');
			}
		}
	}
});