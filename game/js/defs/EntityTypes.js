var EntityTypes = {};

EntityTypes['notlink'] = {
	sprite:'notlink',
	animationSet:'up4_side4_down4',
	abilities:{
		primary:'boomerang',
		secondary:'bomb',
		movement:''
	},
	speed:500,
	acceleration:150,
	hp:10
};

EntityTypes['cloak'] = {
	sprite:'cloak',
	animationSet:'up4_side4_down4',
	abilities:{
		primary:'arrow',
		secondary:'quadArrow',
		movement:''
	},
	speed:400,
	acceleration:100,
	hp:10
};

EntityTypes['feather'] = {
	sprite:'feather',
	animationSet:'up4_side4_down4',
	abilities:{
		primary:'fireKey',
		secondary:'bomb',
		movement:''
	},
	speed:600,
	acceleration:125,
	hp:13
};

entityTypes = [];
for (var type in EntityTypes) {
	entityTypes.push(type);
}