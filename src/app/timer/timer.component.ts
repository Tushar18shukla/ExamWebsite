import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  public initialTime: number = 3 * 60 * 60; // 3 hours in seconds
  public timeLeft: number = this.initialTime;
  public displayTime: string = '03:00:00';  // Initial display time
  private interval: any;

  ngOnInit(): void {
    // Timer won't start automatically
  }

  startTimer(): void {
    this.updateDisplayTime();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateDisplayTime();
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  updateDisplayTime(): void {
    const hours = Math.floor(this.timeLeft / 3600);
    const minutes = Math.floor((this.timeLeft % 3600) / 60);
    const seconds = this.timeLeft % 60;

    this.displayTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
