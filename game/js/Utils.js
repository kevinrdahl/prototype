var Utils = {};

Utils.vary = function(variance) {
	return (Math.random() * 2 - 1) * variance;
}