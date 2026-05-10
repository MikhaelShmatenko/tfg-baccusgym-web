import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  ngOnInit(): void {
    document.body.classList.add('no-bg-image');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('no-bg-image');
  }
}
