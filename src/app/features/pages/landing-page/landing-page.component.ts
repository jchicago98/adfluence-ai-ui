import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VoiceService } from 'src/app/core/services/voice-service/voice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  listOfMessages: any[] = [];
  private socket!: WebSocket;
  private speechSynthesis: SpeechSynthesis;
  websocketURL: string = environment.chatgptWebSocketURL;
  uuidv4Pattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  clientId!: string;
  viewInitialAsset : boolean = true;

  constructor(public service: VoiceService, private http: HttpClient) {
    this.service.init();
    this.speechSynthesis = window.speechSynthesis;
  }

  ngOnInit() {
    this.socket = new WebSocket(this.websocketURL);
    this.clientId = sessionStorage.getItem('clientId') ?? '';
  }

  ngDoCheck() {
    this.socket.onmessage = (event) => {
      if (!this.uuidv4Pattern.test(event.data)) {
        const message = JSON.parse(event.data);
        console.log(message);
        this.listOfMessages.push(message);
        if (message.ai) {
          this.speak(message.ai);
        }
      } else {
        this.clientId = event.data;
        sessionStorage.setItem('clientId', this.clientId);
        this.service.updateClientId(this.clientId);
      }
    };
  }

  speak(text: string) {
    this.service.isSystemSpeaking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      this.service.isSystemSpeaking = false;
      this.startService();
    };
    this.speechSynthesis.speak(utterance);
  }

  startService() {
    this.service.start();
    this.viewInitialAsset = false;
  }

  stopService() {
    this.service.stop();
  }
}
