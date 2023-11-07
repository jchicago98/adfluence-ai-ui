import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenaiVoiceService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  async convertAndPlay(text: string): Promise<void> {
    const response = await this.fetchTextToSpeech(text);
    const audioBlob = new Blob([response]);
    const audioUrl = URL.createObjectURL(audioBlob);
    this.audio.src = audioUrl;
    this.audio.load();
    this.audio.play();
  }

  private async fetchTextToSpeech(text: string): Promise<ArrayBuffer> {
    const apiKey = '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';
    const url = 'https://api.openai.com/v1/audio/speech';
    const requestData = {
      model: 'tts-1',
      voice: 'nova',
      input: text,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestData),
    });

    const audioData = await response.arrayBuffer();
    return audioData;
  }
}