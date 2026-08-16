import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notfound.html',
  styleUrl: './notfound.css',
})
export class NotFound implements OnDestroy {
  // GAME STATE

  gameStarted = false;

  gameOver = false;

  score = 0;

  timeLeft = 30;

  // BOOK POSITION

  bookX = 50;

  bookY = 50;

  // TIMER

  private gameTimer: ReturnType<typeof setInterval> | null = null;

  // START GAME

  startGame(): void {
    this.stopTimer();

    this.gameStarted = true;
    this.gameOver = false;

    this.score = 0;
    this.timeLeft = 30;

    this.moveBook();

    this.gameTimer = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  // CATCH BOOK

  catchBook(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.gameStarted || this.gameOver) {
      return;
    }

    this.score++;

    this.moveBook();
  }

  // MOVE BOOK

  private moveBook(): void {
    this.bookX = this.randomNumber(8, 92);

    this.bookY = this.randomNumber(15, 78);
  }

  // RANDOM NUMBER

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // END GAME

  private endGame(): void {
    this.gameStarted = false;

    this.gameOver = true;

    this.timeLeft = 0;

    this.stopTimer();
  }

  // PLAY AGAIN

  playAgain(): void {
    this.startGame();
  }

  // STOP TIMER

  private stopTimer(): void {
    if (this.gameTimer !== null) {
      clearInterval(this.gameTimer);

      this.gameTimer = null;
    }
  }

  // GO BACK

  goBack(): void {
    window.history.back();
  }

  // DESTROY

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
