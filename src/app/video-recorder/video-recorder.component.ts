import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.css']
})
export class VideoRecorderComponent implements OnInit, AfterViewInit {
  videoElement!: HTMLVideoElement;
  recordVideoElement!: HTMLVideoElement;
  mediaVideoRecorder: any;
  videoRecordedBlobs!: Blob[];
  isRecording: boolean = false;
  downloadVideoUrl!: string;
  recording = false;
  stream!: MediaStream;
  @ViewChild('recordedVideo') recordVideoElementRef!: ElementRef;
  @ViewChild('liveVideo') videoElementRef!: ElementRef;
  constructor() {}

  ngAfterViewInit() {

  }

  async ngOnInit() {
  }
  startVideoRecording() {
    this.recording = !this.recording
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 480
      },
      audio: true
    }).then(stream => {
      this.videoElement = this.videoElementRef.nativeElement;
      this.recordVideoElement = this.recordVideoElementRef.nativeElement;
      this.stream = stream;
      this.videoElement.srcObject = this.stream;
      this.videoRecordedBlobs = [];
      let options: any = {
        mimeType: 'video/webm'
      };
      try {
        this.mediaVideoRecorder = new MediaRecorder(this.stream, options);
      } catch (err) {
        console.log(err);
      }
      this.mediaVideoRecorder.start();
      this.isRecording = !this.isRecording;
      this.onDataAvailableVideoEvent();
      this.onStopVideoRecordingEvent();
    });
  }
  stopVideoRecording() {
    this.recording = !this.recording
    this.mediaVideoRecorder.stop();
    this.isRecording = !this.isRecording;
  }
  playRecording() {
    if (!this.videoRecordedBlobs || !this.videoRecordedBlobs.length) {
      return;
    }
    this.recordVideoElement.play();
  }
  onDataAvailableVideoEvent() {
    try {
      this.mediaVideoRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.videoRecordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }
  onStopVideoRecordingEvent() {
    try {
      this.mediaVideoRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.videoRecordedBlobs, {
          type: 'video/webm'
        });
        this.downloadVideoUrl = window.URL.createObjectURL(videoBuffer);
        this.recordVideoElement.src = this.downloadVideoUrl;
      };
    } catch (error) {
      console.log(error);
    }
  }
}
