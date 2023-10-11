import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-speak-with-ai',
  templateUrl: './speak-with-ai.component.html',
  styleUrls: ['./speak-with-ai.component.css'],
})
export class SpeakWithAiComponent {
  title = 'micRecorder';
  record: any;
  recording = false;
  url: string | undefined;
  error: string | undefined;
  constructor(private domSanitizer: DomSanitizer) {}
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  successCallback(stream: any) {
    var options = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      sampleRate: 16000,
    };
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream);
    this.record.record();
  }
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }
  processRecording(blob: Blob | MediaSource) {
    this.url = URL.createObjectURL(blob);
  }
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }
  ngOnInit() {}
}
