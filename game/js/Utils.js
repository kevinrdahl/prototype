var Utils = {};

Utils.vary = function(variance) {
	return (Math.random() * 2 - 1) * variance;
}

Utils.pickRandom = function(list) {
	var index = Math.floor(Math.random() * list.length);
	return list[index];
}