import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ElevenLabsService {
  voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel Voice

  elevenLabsHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'audio/mpeg',
    }),
  };

  constructor(private http: HttpClient) {}

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
