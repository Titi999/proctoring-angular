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
  interval: any
  counter: number = 0;
  idleTime: number = 0;

  constructor(private tabDetectionService: TabDetectionService,
              private idleService: IdleService) {}

  ngOnInit() {
    navigator.mediaDevices.enumerateDevices().then(device=>{console.log(device)})
    this.idleTime = this.idleService.counter
    // Subscribe to the counter change event
    this.idleService.counterChange.subscribe((counter: number) => {
      this.idleTime = counter;
    });

    this.tabDetectionService.tabStatus$.subscribe(status => {

      if (status) {
        this.clearFocusCounter()
        console.log('Tab is in focus');
      } else {
        this.focusCounter()
        console.log('Tab is not in focus');
       // this.tabDetectionService.captureScreenshot().then(result => {
       //   this.screenshotUrl = result
       //   // console.log(result)
       // })
        // this.captureScreen()
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

  focusCounter() {
    this.interval = setInterval(() => {
      this.counter++;
    }, 1000);
  }

  clearFocusCounter() {
    clearInterval(this.interval)
  }


  @HostListener('window:mousemove')
  @HostListener('window:scroll')
  @HostListener('window:keypress')
  @HostListener('window:click')
  onUserAction() {
    this.idleService.resetIdleTimer();
    this.idleService.clearCounters()
  }


  // captureScreen() {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
  //     // @ts-ignore
  //     navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' } })
  //       .then(stream => {
  //         const videoTrack = stream.getVideoTracks()[0];
  //
  //         const videoElement = document.createElement('video');
  //         videoElement.srcObject = new MediaStream([videoTrack]);
  //         videoElement.autoplay = true;
  //
  //
  //         document.body.appendChild(videoElement);
  //
  //         const canvasElement = document.createElement('canvas');
  //         const context = canvasElement.getContext('2d');
  //
  //
  //         videoElement.addEventListener('playing', () => {
  //
  //           canvasElement.width = videoElement.videoWidth;
  //           canvasElement.height = videoElement.videoHeight;
  //
  //           context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  //
  //
  //           this.screenshotUrl = canvasElement.toDataURL('image/png')
  //
  //           // Stop the screen capture
  //           videoTrack.stop();
  //           videoElement.remove();
  //           canvasElement.remove();
  //         });
  //       })
  //       .catch(error => {
  //         console.error('Error capturing screen:', error);
  //       });
  //   } else {
  //     console.error('Screen capture API is not supported.');
  //   }
  // }

  captureScreen() {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      // @ts-ignore
      navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' } })
        .then(stream => {
          const videoTrack = stream.getVideoTracks()[0];

          // Create a video element to display the screen capture
          const videoElement = document.createElement('video');
          videoElement.srcObject = new MediaStream([videoTrack]);
          videoElement.autoplay = true;

          // Append the video element to the body (or any other desired container)
          document.body.appendChild(videoElement);

          // Create a canvas element to capture the video frame
          const canvasElement = document.createElement('canvas');
          const context = canvasElement.getContext('2d');

          // Wait for the video to load and play
          videoElement.addEventListener('playing', () => {
            // Set the canvas dimensions to match the video element
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;

            // Draw the current video frame on the canvas
            context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

            // Convert canvas to image
            const screenshot = canvasElement.toDataURL('image/png');

            // Open the screenshot in a new tab (optional)
            // const newTab = window.open();
            // newTab.document.body.innerHTML = '<img src="' + screenshot + '" />';
            this.screenshotUrl = screenshot;

            // Stop the screen capture
            videoTrack.stop();
            videoElement.remove();
            canvasElement.remove();
          });
        })
        .catch(error => {
          alert("User has denied access to screen sharing")
        });
    } else {
      console.error('Screen capture API is not supported.');
    }
  }




}
