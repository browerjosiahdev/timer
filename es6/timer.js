class Timer {
    animationFrame () {
        if (this.timer !== undefined) {
    		if (this.repeatTracker > 0) {
    			var difference = new Date().getTime() - this.timer;
    			if (difference >= this.interval) {
    				this.timer = new Date().getTime() - (difference - this.interval);
    				this.repeatTracker--;
    				this.update();
    			}
    			window.requestAnimationFrame(function() {
    				this.animationFrame();
    			}.bind(this));
    		} else {
    			this.complete();
    		}
    	}
    }
    complete () {
        this.pause();
    	try {
    		$(this).trigger({ type: Timer.TIMER_COMPLETE, timer: this, timeRemaining: this.repeatTracker });
    	} catch( error ) {
    		throw new ReferenceError(Timer.DISPATCH_ERROR.replace(/%function%/g, 'Timer.complete();'));
    	}
    }
    constructor (interval, repeat) {
        this.interval = interval;
        this.repeat = this.repeatTracker = repeat;
	    this.timer;
    }
    getCurrentCount () {
        return (this.repeat - this.repeatTracker);
    }
    getInterval () {
        return this.interval;
    }
    getRepeatCount () {
        return this.repeat;
    }
    getRunning () {
        return (this.timer !== undefined);
    }
    pause () {
        this.timer = undefined;
    }
    reset () {
        this.repeatTracker = this.repeat;
    	try {
    		$(this).trigger({ type: Timer.TIMER_RESET, timer: this, timeRemaining: this.repeatTracker, running: this.getRunning() });
    	} catch( error ) {
    		throw new ReferenceError(Timer.DISPATCH_ERROR.replace(/%function%/g, 'Timer.reset();'));
    	}
    }
    start () {
        if (this.timer === undefined) {
    		this.timer = new Date().getTime();
    		window.requestAnimationFrame(function() {
    			this.animationFrame();
    		}.bind(this));
    	}
    }
    update () {
        try {
    		$(this).trigger({ type: Timer.TIMER, timer: this, timeRemaining: this.repeatTracker });
    	} catch( error ) {
    		throw new ReferenceError(Timer.DISPATCH_ERROR.replace(/%function%/g, 'Timer.update();'));
    	}
    }
}
Timer.TIMER = 'timer';
Timer.TIMER_COMPLETE = 'timer-complete';
Timer.TIMER_RESET = 'timer-reset';
Timer.DISPATCH_ERROR = 'Not able to dispatch event, please make sure you are including jQuery in your project: %function%';
