import {EventEmitter} from 'events';

class Timer extends EventEmitter {
  constructor(interval, repeat = Infinity, useTimeout = false) {
    super();

    this.listeners = {};
    this.milliseconds = 0;
    this.interval = interval;
    this.repeat = this.repeatTracker = repeat;
    this.useTimeout = useTimeout;
    this.timeoutDelay = Math.round(interval / 20);
    this.timer;
  }
  /**
  * Getter methods
  */
  getCurrentCount() {
    return (this.repeat - this.repeatTracker);
  }
  getInterval() {
    return this.interval;
  }
  getMilliseconds() {
    return this.milliseconds;
  }
  getRepeatCount() {
    return this.repeat;
  }
  getRunning() {
    return (this.timer !== undefined);
  }
  /**
  * Event listener methods
  */
   // Included for backwards compatibility.
  addEventListener(type, callback) {
    this.addListener(type, callback);
  }
  requestFrame (callback) {
    if (this.useTimeout) {
      this.timeoutId = setTimeout(callback, this.timeoutDelay);
    } else {
      window.requestAnimationFrame(callback);
    }
  }
  animationFrame() {
    if (this.timer !== undefined) {
      if (this.repeatTracker > 0) {
        const difference = (new Date().getTime() - this.timer);

        if (difference >= this.interval) {
          this.milliseconds += this.interval;

          this.timer = (new Date().getTime() - (difference - this.interval));
          this.repeatTracker--;

          this.update();
        }

        this.requestFrame(function() {
          this.animationFrame();
        }.bind(this));
      } else {
        this.complete();
      }
    }
  }
  complete() {
    this.pause();

    this.emit(Timer.TIMER_COMPLETE, { timer: this, timeRemaining: this.repeatTracker });
  }
  pause() {
    this.useTimeout && clearTimeout(this.timeoutId);
    this.timer = undefined;
  }
  reset() {
    this.milliseconds = 0;
    this.repeatTracker = this.repeat;

    this.emit(Timer.TIMER_RESET, {
      timer: this,
      timeRemaining: this.repeatTracker,
      running: this.getRunning()
    });
  }
   // Included for backwards compatibility.
  removeEventListener(type, callback) {
    this.removeListener(type, callback);
  }
  start() {
    if (this.timer === undefined) {
      this.timer = new Date().getTime();

      this.requestFrame(function() {
        this.animationFrame();
      }.bind(this));
    }
  }
  update() {
    this.emit(Timer.TIMER, { timer: this, timeRemaining: this.repeatTracker });
  }
}
Timer.TIMER = 'timer';
Timer.TIMER_COMPLETE = 'timer-complete';
Timer.TIMER_RESET = 'timer-reset';
Timer.DISPATCH_ERROR = 'Not able to dispatch event, please make sure you are including jQuery in your project: %function%';

export default Timer;
