import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VoiceService } from 'src/app/core/services/voice-service/voice.service';

@Component({
  selector: 'app-speak-with-ai',
  templateUrl: './speak-with-ai.component.html',
  styleUrls: ['./speak-with-ai.component.css'],
})
export class SpeakWithAiComponent {
  records$: any;
  audioRecording: any;
  userText!: string;

  message: string = '';

  constructor(public service: VoiceService) {
    this.service.init();
  }

  ngOnInit() {
    this.records$ = this.service.getRecords();
  }

  ngDoCheck() {

  }

  startService() {
    this.service.start();
  }

  stopService() {
    this.service.stop();
  }

}
