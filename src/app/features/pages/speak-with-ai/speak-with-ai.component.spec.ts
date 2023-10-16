import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakWithAiComponent } from './speak-with-ai.component';

describe('SpeakWithAiComponent', () => {
  let component: SpeakWithAiComponent;
  let fixture: ComponentFixture<SpeakWithAiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpeakWithAiComponent]
    });
    fixture = TestBed.createComponent(SpeakWithAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
