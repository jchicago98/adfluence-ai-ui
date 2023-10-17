import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

declare var webkitSpeechRecognition: any;
declare var MediaRecorder: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: any;
  websocketURL : string = environment.chatgptWebSocketURL;

  private socket!: WebSocket;
  records$ = new BehaviorSubject(undefined);
  recording = null;
  mediaRecorder: any;
  mediaObserver: any;
  audio: any;
  stream: any;

  constructor() {}

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
    });
  }

  start() {
    this.socket = new WebSocket(this.websocketURL);
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    this.recognition.addEventListener('end', (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.wordConcat();
        this.recognition.start();
        this.onRecord();
        if (this.text != ' .') {
          this.text = this.text.substring(1);
          this.text = this.text.replaceAll('.', '');
          this.text = this.text.replace(/^\s+/, '');
          if (this.text.length > 0) {
            this.socket.send(this.text);
          }
        }

        this.text = '';
      }
    });
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();

    this.mediaRecorder.stop();
    setTimeout(
      () => this.stream.getTracks().forEach((track: any) => track.stop()),
      0
    );
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }

  getRecords() {
    return this.records$.asObservable();
  }

  getUserText() {
    return this.text;
  }

  onRecord() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.stream = stream;
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();

      const audioChunks: any = [];
      this.mediaRecorder.addEventListener('dataavailable', (event: any) => {
        audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio = new Audio(audioUrl) as HTMLAudioElement;

        let newSet: any;
        if (this.records$.getValue()) {
          newSet = this.records$.getValue();
          newSet.push({ media: this.audio, label: this.text });
          this.records$.next(newSet);
        }
        //this.records$.next(null);
        console.log('stopped recording');
      });
    });
  }
}
