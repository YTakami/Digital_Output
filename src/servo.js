// KPR Script file
exports.pins = {
	servo: { type: "PWM" }
}

exports.configure = function() {
	this.servo.init();
}

exports.rotate = function() {
	this.servo.write( .3 );
}

exports.stop = function() {
	this.servo.write( 0 );
}

exports.close = function() {
	this.servo.close();
}
