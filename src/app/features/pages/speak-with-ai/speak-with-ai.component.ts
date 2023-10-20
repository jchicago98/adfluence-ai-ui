import { Component } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { VoiceService } from 'src/app/core/services/voice-service/voice.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-speak-with-ai',
  templateUrl: './speak-with-ai.component.html',
  styleUrls: ['./speak-with-ai.component.css'],
})
export class SpeakWithAiComponent {
  listOfMessages: any[] = [];
  private socket!: WebSocket;
  voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel Voice
  private speechSynthesis: SpeechSynthesis;
  websocketURL: string = environment.chatgptWebSocketURL;
  uuidv4Pattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  clientId!: string;

  elevenLabsHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'audio/mpeg',
    }),
  };

  textToSpeech(text: string): Observable<ArrayBuffer> {
    const schema = {
      text: text,
      model_id: 'eleven_monolingual_v1',
      xi_api_key: 'ELEVEN_LABS_API_KEY',
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
        style: 0,
        use_speaker_boost: true,
      },
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post(
        'https://api.elevenlabs.io/v1/text-to-speech/' + this.voiceId,
        schema,
        {
          responseType: 'arraybuffer',
          headers: headers,
        }
      )
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

  constructor(public service: VoiceService, private http: HttpClient) {
    this.service.init();
    this.speechSynthesis = window.speechSynthesis;
  }

  ngOnInit() {
    this.socket = new WebSocket(this.websocketURL);
  }

  ngDoCheck() {
    this.socket.onmessage = (event) => {
      // console.log(event);
      if (!this.uuidv4Pattern.test(event.data)) {
        const message = JSON.parse(event.data);
        console.log(message);
        this.listOfMessages.push(message);
        if (message.ai) {
          this.stopService();
          this.speak(message.ai);
          //this.elevenLabsTextToSpeech(message.ai);
          this.startService();
        }
      } else {
        this.clientId = event.data;
        this.service.updateClientId(this.clientId);
      }
    };
  }

  elevenLabsTextToSpeech(message: string) {
    this.textToSpeech(message).subscribe((data) => {
      const audioContext = new window.AudioContext();
      audioContext.decodeAudioData(
        data,
        (buffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
        },
        (error) => {
          console.error('Error decoding audio data', error);
        }
      );
    });
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    this.speechSynthesis.speak(utterance);
  }

  startService() {
    this.service.start();
  }

  stopService() {
    this.service.stop();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
