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
  private screenStream: MediaStream | null = null;

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
        this.screenStream = stream
        console.log(stream)
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

  public takeScreenshot() {
    if (!this.screenStream) {
      console.log('No shared screen stream available.');
      return null;
    }
    const videoElement = document.createElement('video');
    videoElement.srcObject = this.screenStream;
    videoElement.autoplay = true;
    videoElement.style.position = 'fixed';
    videoElement.style.left = '0';
    videoElement.style.top = '0';
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.zIndex = '999999';
    videoElement.style.pointerEvents = 'none';
    document.body.appendChild(videoElement);

    return new Promise<string>((resolve) => {
      videoElement.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const screenshotDataUrl = canvas.toDataURL('image/png');
        document.body.removeChild(videoElement);
        resolve(screenshotDataUrl);
      };
    });

  }
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
