var PATHING_OPEN = 0;
var PATHING_BLOCKED = 1;

var WorldFragment = Class({
	$static: {
		fromData: function(obj) {
			var fragment = new WorldFragment(obj.width, obj.height);
		}
	},
	
	constructor: function(width, height) {
		this.pathing = [];
		
		this.setSize(width, height);
	},
	
	setSize: function(width, height) {
		this.width = width;
		this.height = height;
		
		var currentHeight = this.pathing.length;
		var currentWidth = (currentHeight == 0) ? 0 : this.pathing[0].length;
		
		if (height < currentHeight) {
			this.pathing.splice(height, currentHeight-height);
		} else if (height > currentHeight) {
			for (var y = currentHeight; y < height; y++) {
				this.pathing.push([]);
				for (var x = 0; x < width; x++) {
					this.pathing[y].push(PATHING_OPEN);
				}
			}
		}
		
		if (width < currentWidth) {
			for (var y = 0; y < height; y++) {
				this.pathing[y].splice(width, currentWidth-width);
			}
		} else if (width > currentWidth) {
			for (var y = 0; y < height; y++) {
				for (var x = this.pathing[y].length; x < width; x++) {
					this.pathing[y].push(PATHING_OPEN);
				}
			}
		}
	},
	
	add: function() {
		//add to za warudo
	},
	
	remove: function() {
		//remove all its bits from za warudo
	}
});