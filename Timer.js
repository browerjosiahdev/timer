// The MIT License (MIT)
//
// Copyright (c) 2015 Josiah James Brower
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
var console;
if (console === undefined) {
	console = {
		'log': function(){},
		'dir': function(){},
		'warn': function(){}
	};
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Class Timer.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Timer = function( interval, repeat ) {
	this.p_interval      = interval;
	this.p_repeat        = repeat;
	this.p_repeatTracker = this.p_repeat;
	this.p_timer;
};

Timer.TIMER          = 'TIMER';
Timer.TIMER_COMPLETE = 'TIMERCOMPLETE';
Timer.TIMER_RESET    = 'TIMERRESET';
Timer.DISPATCH_ERROR = 'Not able to dispatch event, please make sure you are including jQuery in your project: %function%';

Timer.prototype.start = function() {
	if (this.p_timer === undefined) {
		this.p_timer = new Date().getTime();
		
		var _this = this;
		window.requestAnimationFrame(function() {
			_this.animationFrame.call(_this);
		});
	}
};

Timer.prototype.animationFrame = function() {
	if (this.p_timer !== undefined) {
		if (this.p_repeatTracker > 0) {
			var difference = new Date().getTime() - this.p_timer;
			if (difference >= this.p_interval) {
				this.p_timer = new Date().getTime() - (difference - this.p_interval);
				
				this.p_repeatTracker--;
				this.update();
			}
			
			var _this = this;
			window.requestAnimationFrame(function() {
				_this.animationFrame.call(_this);
			});
		} else {
			this.complete();
		}
	}
};

Timer.prototype.pause = function() { 
	this.p_timer = undefined;
};

Timer.prototype.reset = function() {
	this.p_repeatTracker = this.p_repeat;
	
	try {
		$(this).trigger({
			'type': Timer.TIMER_RESET,
			'timer': this,
			'timeRemaining': this.p_repeatTracker,
			'running': this.getRunning()
		});
	} catch( error ) {
		throw new ReferenceError(Timer.DISPATCH_ERROR.replace(/%function%/g, 'Timer.reset();'));
	}
};

Timer.prototype.update = function() {	
	try {
		$(this).trigger({
			'type': Timer.TIMER,
			'timer': this,
			'timeRemaining': this.p_repeatTracker
		});
	} catch( error ) {
		throw new ReferenceError(Timer.DISPATCH_ERROR.replace(/%function%/g, 'Timer.update();'));
	}
};

Timer.prototype.complete = function() {
	this.pause();
	
	try {
		$(this).trigger({
			'type': Timer.TIMER_COMPLETE,
			'timer': this,
			'timeRemaining': this.p_repeatTracker
		});
	} catch( error ) {
		throw new ReferenceError(Timer.DISPATCH_ERROR.replace(/%function%/g, 'Timer.complete();'));
	}
};

Timer.prototype.getRunning = function() {
	return (this.p_timer !== undefined);
};

Timer.prototype.getCurrentCount = function() {
	return (this.p_repeat - this.p_repeatTracker);
};

Timer.prototype.getRepeatCount = function() {
	return this.p_repeat;
};

Timer.prototype.getInterval = function() {
	return this.p_interval;
};