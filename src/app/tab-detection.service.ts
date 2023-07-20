import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class TabDetectionService {
  private lazyStream:any
  currentPeer:any
  private tabStatusSource = new Subject<boolean>();
  tabStatus$ = this.tabStatusSource.asObservable();
  private Sharescreen = new Subject<boolean>()

  constructor() {
    this.initializeTabDetection();
  }

  private initializeTabDetection(): void {
    window.addEventListener('focus', () => {
      this.tabStatusSource.next(true); // User switched to the tab
    });

    window.addEventListener('blur', () => {
      // this.captureScreenshot(); // Capture screenshot when tab loses focus
      this.tabStatusSource.next(false); // User switched away from the tab
    });
  }

  public shareScreen():Promise<string> {

    return new Promise<string>((resolve, reject) => {
      (<any> navigator.mediaDevices).getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }

      }).then((stream:any) => {
        const videoTrack = stream.getVideoTracks()[0];
        resolve(videoTrack);
        videoTrack.onended = () => {
          this.stopScreenShare();


        };


      }).catch((err:any) => {
        console.log('Unable to get display media ' + err);
        this.Sharescreen.next(false)
      });
    });
  }

  private stopScreenShare() {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find((s:any) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);

  }

  // public captureScreenshot(): void {
  //   const body = document.querySelector('body');
  //   html2canvas(body!).then(canvas => {
  //     // Convert canvas to image URL
  //     const screenshotUrl = canvas.toDataURL();
  //
  //     // Send the screenshotUrl to a server or perform any desired actions
  //     console.log('Screenshot captured:', screenshotUrl);
  //   });
  // }

  public captureScreenshot(): Promise<string> {
    const body = document.querySelector('body');
    return new Promise<string>((resolve, reject) => {
      html2canvas(body!).then(canvas => {
        // Convert canvas to image URL
        const screenshotUrl = canvas.toDataURL();
        resolve(screenshotUrl);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
