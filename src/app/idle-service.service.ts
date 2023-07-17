import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimer: any;
  private idleTimeThreshold: number = 30 * 1000; // 5 minutes (in milliseconds)
  interval: any
  counter: number = 0;
  counterChange: EventEmitter<number> = new EventEmitter<number>();
  constructor() {
    this.resetIdleTimer();
    this.setupIdleListener();
  }

  private setupIdleListener() {
    window.addEventListener('mousemove', this.resetIdleTimer.bind(this));
    window.addEventListener('scroll', this.resetIdleTimer.bind(this));
    window.addEventListener('keypress', this.resetIdleTimer.bind(this));
    window.addEventListener('click', this.resetIdleTimer.bind(this));
  }

  counters() {
    this.interval = setInterval(() => {
      console.log('Idle time:', this.counter);
      this.counter++;
      this.counterChange.emit(this.counter);
    }, 1000);
  }

  public clearCounters() {
    clearInterval(this.interval)
    console.log('User was idle for: ', this.counter, ' seconds')
  }
  public resetIdleTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      // Perform actions when user is considered idle
      console.log('User is idle');
      this.counters()
    }, this.idleTimeThreshold);
  }
}
