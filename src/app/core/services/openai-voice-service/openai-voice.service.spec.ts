import { TestBed } from '@angular/core/testing';

import { OpenaiVoiceService } from './openai-voice.service';

describe('OpenaiVoiceService', () => {
  let service: OpenaiVoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenaiVoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
