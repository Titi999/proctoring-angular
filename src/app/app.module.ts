import {NgModule, OnInit} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoRecorderComponent } from './video-recorder/video-recorder.component';
import {GuidedTour, GuidedTourModule, GuidedTourService} from "ngx-guided-tour";
import { CircularProgressComponent } from './circular-progress/circular-progress.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoRecorderComponent,
    CircularProgressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuidedTourModule
  ],
  providers: [
    GuidedTourService
  ],
  bootstrap: [AppComponent]
})
export class AppModule{

}
