import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  mouseX: number = 0;
  mouseY: number = 0;
  highlightX: number = 0;
  highlightY: number = 0;
  highlightColor: string = 'transparent'; // Initialize with a transparent background

  constructor(private router: Router) {}

  ngOnInit() {}

  routeToSpeakWithAIPage(){
    this.router.navigate(['/speak']);
  }

}
