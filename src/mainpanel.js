// KPR Script file
var count = 0;
var lineNo = 0;
var stride = 16;
var servostate = false;
var rotate = false;
var ledstate = [];
var pulse1 = 1.1;
var pulse2 = 1.7;

var Startbehavior = function(){
}
Startbehavior.prototype = Object.create(Object.prototype, {
	onTouchBegan: {
		value: function(start) {
			count = 0;
			lineNo = 0;
			
			pulseWidth = 1.1;
			
			if(!servostate){
				servostate = true;
                start.interval = 1000;
                start.start();
                pulse1 = 1.1;
				pulse2 = 1.7;
                                
                start.first.string="stop";
			}
			else{
            	servostate = false;
                start.stop();
                start.first.string = "start";
                pulse1 = 1.3;
                pulse2 = 1.3
                //application.invoke(new MessageWithObject("pins:/motor/pulse1", pulse1));
                //application.invoke(new MessageWithObject("pins:/motor/pulse2", pulse2));
            }
            
		}
	},
	onTimeChanged: {
		value: function(start){
		
			if(servostate){
				//rotate the servos
				if(rotate){
					pulse1 = 1.1;
					pulse2 = 1.7
					//25*20ms = 1000ms
					//change it according to interval
					for(var x=0;x<25;x++){
						application.invoke(new MessageWithObject("pins:/motor/pulse1", pulse1));
                		application.invoke(new MessageWithObject("pins:/motor/pulse2", pulse2));
                	}
					count++;
					if(count>2) {
						count = 0;
						pulse1 = 1.3;
						pulse2 = 1.3
						for(var x=0;x<25;x++){
							application.invoke(new MessageWithObject("pins:/motor/pulse1", pulse1));
                			application.invoke(new MessageWithObject("pins:/motor/pulse2", pulse2));
                		}
						rotate = false;
						lineNo++;
						if(lineNo == stride) {
							servostate = false;
							start.stop();
						}
					}
				}
				//led
				else{
					for(var x=0;x<stride;x++){
						if(ledstate[x+lineNo*stride]) {
							application.invoke(new MessageWithObject("pins:/light/turnOn"+(x+1)));//Check whether it works							
						}
					}
					count++;// =second
					//change here to change the toast time
					if(count > 15){
						count=0;
						for(var x=0;x<stride;x++){
							application.invoke(new MessageWithObject("pins:/light/turnOff"+(x+1)));//Check whether it works
						}
						rotate = true;
					}
				}
			}
			
		}
	},
});

var Panel = function () {
}
Panel.prototype = Object.create(Object.prototype, {
	onTouchBegan: {
		value: function(p) {
			if(!ledstate[p.variant]){
				p.skin = new Skin("red");
				ledstate[p.variant] = true;
			}else{
				p.skin = new Skin("white");
				ledstate[p.variant] = false;
			}
		}
	},
});

// KPR Script file
var build = function(container) {
	container.skin = new Skin("blue");
    for(var i=0;i<stride*stride;i++) ledstate[i] = false; 
        	
	var l=10;	
	for(var i=0;i<stride;i++){
		for(var j=0;j<stride;j++){
			var p = new Content({left:i*l+ 80,top:j*l + 20, width:l,height:l },new Skin("white"));
			p.behavior = new Panel();
			p.active = true;
			p.variant = i + j*16;
			container.add(p);
		}
	}
	
	var start = new Container({left:160,top:180, width:80,height:30 },new Skin("gray"));
	start.behavior = new Startbehavior();
	start.active = true;
	var te = new Style("bold 20px", "white");
	var label = new Label(null, null, te, "start");
	start.add(label);
	container.add(start);
	
}

application.behavior = {
	onAdapt: function(application) {
		application.empty();
		build(application);
	},
	onLaunch: function(application) {
		build(application);
	},
}
//check the pins before you use the program
/*
application.invoke(new MessageWithObject("pins:configure", { 
	motor:{
		require: "motor",
        pins:{
        	motor1: {pin: 4},
        	motor2: {pin: 6}
		}
	}
}));
application.invoke(new MessageWithObject( "pins:configure", {
		    light: {
		        require: "led",
		        pins: {
		        led1: {pin: 4},
		        led2: {pin: 6},
		        led3: {pin: 8},
		        led4: {pin: 10},
		        led5: {pin: 12},
		        led6: {pin: 16},
		        led7: {pin: 18},
		        led8: {pin: 20},
		        led9: {pin: 22},
		        led10: {pin: 24},
		        led11: {pin: 3},
		        led12: {pin: 5},
		        led13: {pin: 7},
		        led14: {pin: 9},
		        led15: {pin: 11},
		        led16: {pin: 15}
		        }
		    }
	}));
*/