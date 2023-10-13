import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VoiceService } from 'src/app/core/services/voice-service/voice.service';

@Component({
  selector: 'app-speak-with-ai',
  templateUrl: './speak-with-ai.component.html',
  styleUrls: ['./speak-with-ai.component.css'],
})
export class SpeakWithAiComponent {
  listOfMessages: any[] = [];
  private socket!: WebSocket;

  constructor(public service: VoiceService) {
    this.service.init();
  }

  ngOnInit() {
    this.socket = new WebSocket('ws://localhost:443/');
  }

  ngDoCheck() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      this.listOfMessages.push(message);
      console.log(this.listOfMessages);
    };
  }

  startService() {
    this.service.start();
  }

  stopService() {
    this.service.stop();
  }
}
