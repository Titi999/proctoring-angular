import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.css']
})
export class CircularProgressComponent implements OnInit{

  progress: number = 90;

  constructor() { }

  ngOnInit() {
    this.setProgress(this.progress);
  }

  setProgress(percentage: number) {
    const progressBar = document.querySelector('.progress') as HTMLElement;
    const progressText = document.querySelector('.progress-text') as HTMLElement;

    const circumference = 2 * Math.PI * 45;
    const offset = (percentage / 100) * circumference;

    progressBar.style.strokeDasharray = `${offset} ${circumference}`;
    progressText.textContent = `${percentage}%`;
  }
}
