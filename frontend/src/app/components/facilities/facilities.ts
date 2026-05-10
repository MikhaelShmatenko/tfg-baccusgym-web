import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-facilities',
  imports: [],
  templateUrl: './facilities.html',
  styleUrl: './facilities.css',
})
export class Facilities {
  images = [
    '/images/facilities/carrousel1.jpeg',
    '/images/facilities/carrousel2.jpeg',
    '/images/facilities/carrousel3.jpeg',
    '/images/facilities/carrousel4.jpeg',
    '/images/facilities/carrousel5.jpeg',
    '/images/facilities/carrousel6.jpeg',
    '/images/facilities/carrousel7.jpeg',
    '/images/facilities/carrousel8.jpeg',
  ];

  currentIndex = signal(0);

  prev() {
    this.currentIndex.update(i => (i - 1 + this.images.length) % this.images.length);
  }

  next() {
    this.currentIndex.update(i => (i + 1) % this.images.length);
  }

  getCardClass(index: number): string {
    const current = this.currentIndex();
    const total = this.images.length;
    if (index === current) return 'active';
    if (index === (current - 1 + total) % total) return 'prev';
    if (index === (current + 1) % total) return 'next';
    return 'hidden';
  }
}
