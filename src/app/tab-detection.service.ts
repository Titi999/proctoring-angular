import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class TabDetectionService {
  private tabStatusSource = new Subject<boolean>();
  tabStatus$ = this.tabStatusSource.asObservable();

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
