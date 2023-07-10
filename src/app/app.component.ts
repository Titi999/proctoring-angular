import {Component, HostListener, OnInit} from '@angular/core';
import {TabDetectionService} from "./tab-detection.service";
import {IdleService} from "./idle-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isTabInFocus = true;
  screenshotUrl: string | null = null;

  constructor(private tabDetectionService: TabDetectionService,
              private idleService: IdleService) {}

  ngOnInit() {
    this.tabDetectionService.tabStatus$.subscribe(status => {
      console.log(status)
      if (status) {
        // The tab is in focus
        console.log('Tab is in focus');
      } else {
        console.log('Tab is not in focus');
       this.tabDetectionService.captureScreenshot().then(result => {
         this.screenshotUrl = result
         console.log(result)
       })
        // The tab is not in focus
      }
    });

    this.inactivityTime()
  }

  inactivityTime() {
    let time: any;
    window.onload = resetTimer;
    console.log(time)
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    function resetTimer() {
      clearTimeout(time);
      // time = setTimeout(logout, 3000)
    }
  };



  @HostListener('window:mousemove')
  @HostListener('window:scroll')
  @HostListener('window:keypress')
  @HostListener('window:click')
  onUserAction() {
    this.idleService.resetIdleTimer();
    this.idleService.clearCounters()
  }
}
