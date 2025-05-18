import { Component, OnInit } from '@angular/core';
import confetti from 'canvas-confetti'
@Component({
  selector: 'app-celebration',
  imports: [],
  templateUrl: './celebration.component.html',
  styleUrl: './celebration.component.css'
})
export class CelebrationComponent implements OnInit{
  ngOnInit(): void {
    this.fireConfetti();
    setTimeout(() => {
      document.getElementById('celebration-overlay')?.classList.add('hide');
    }, 4000); // Hide after 4 seconds
  }

  fireConfetti(): void {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 10,
        angle: 110,
        spread: 1000,
        origin: { y: 0 }
      });
      // confetti({
      //   particleCount: 5,
      //   angle: 120,
      //   spread: 55,
      //   origin: { x: 1 }
      // });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}
