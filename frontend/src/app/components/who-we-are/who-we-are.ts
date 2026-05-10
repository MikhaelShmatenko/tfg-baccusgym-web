import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-who-we-are',
  imports: [],
  templateUrl: './who-we-are.html',
  styleUrl: './who-we-are.css',
})
export class WhoWeAre {
  isPlaying = signal(false);
  volume = signal(1);
  private lastVolume = 1;

  volumeIcon = computed(() => {
    const v = this.volume();
    if (v === 0) return 'volume_off';
    if (v <= 0.5) return 'volume_down';
    return 'volume_up';
  });

  togglePlay(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
      this.isPlaying.set(true);
    } else {
      video.pause();
      this.isPlaying.set(false);
    }
  }

  toggleMuteIcon(video: HTMLVideoElement) {
    if (this.volume() > 0) {
      this.lastVolume = this.volume();
      video.volume = 0;
      this.volume.set(0);
    } else {
      video.volume = this.lastVolume;
      this.volume.set(this.lastVolume);
    }
  }

  onVolumeChange(video: HTMLVideoElement, event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    video.volume = value;
    this.volume.set(value);
    if (value > 0) this.lastVolume = value;
  }

  onVideoEnded() {
    this.isPlaying.set(false);
  }
}
