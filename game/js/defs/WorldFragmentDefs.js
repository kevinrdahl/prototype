var WorldFragments = {};
var defaultLegend = {
	'X':{type:'obstacle', obstacle:'blocker'}
}

WorldFragments['8x8empty'] = {
	width:8,
	height:8,
	legend:defaultLegend,
	
	tiles:[
		'XXXXXXXX',
		'X      X',
		'X      X',
		'X      X',
		'X      X',
		'X      X',
		'X      X',
		'XXXXXXXX'
	]
};

WorldFragments['8x8middleblock'] = {
	width:8,
	height:8,
	legend:defaultLegend,
	
	tiles:[
		'XXXXXXXX',
		'X      X',
		'X      X',
		'X  XX  X',
		'X  XX  X',
		'X      X',
		'X      X',
		'XXXXXXXX'
	]
};