import { Component } from '@angular/core';

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

  constructor() {}

  ngOnInit() {}

  onMouseMove(event: MouseEvent) {
    // Update the mouse coordinates
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    // Update the position of the highlight element
    this.highlightX = this.mouseX;
    this.highlightY = this.mouseY;

    // Update the background color of the highlight element based on mouse coordinates
    this.updateHighlightColor();
  }

  updateHighlightColor() {
    // Calculate the background color based on mouse coordinates
    // You can adjust this logic to fit your specific needs
    const red = this.mouseX % 256;
    const green = this.mouseY % 256;
    const blue = (this.mouseX + this.mouseY) % 256;

    // Construct the background color string
    this.highlightColor = `rgba(${red},${green},${blue}, 0.5)`;
  }
}
