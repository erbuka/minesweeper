import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { ContextService, GameState } from './context.service';
import { Minesweeper, Difficulty, Cell } from 'src/classes/mine-sweeper';

const paddingUD = 64 + 16;
const paddingLR = 16;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private _cellSize: number = 0;
  private _timeInterval: any = null;

  time: number = 0;
  showMenu: boolean = false;

  numberColors: string[] = [
    "w3-text-blue", "w3-text-green", "w3-text-red", "w3-text-indigo",
    "w3-text-brown", "w3-text-cyan", "w3-text-black", "w3-text-dark-grey"
  ];

  constructor(public context: ContextService) { }

  gameOver(victory: boolean = false): void {
    let b = this.context.board
    b.cells.filter(c => !c.discovered).forEach(c => c.discovered = true);    
    this.context.gameState = GameState.GameOver;
    this.context.victory = victory;
    this.stopTimer();
  }

  newGame(d: Difficulty | string) {

    this.time = 0;
    this.context.gameState = GameState.Playing;

    switch (d) {
      case Difficulty.Beginner:
        this.context.board = new Minesweeper(8, 10, 10);
        break;
      case Difficulty.Intermediate:
        this.context.board = new Minesweeper(16, 18, 40);
        break;
      case Difficulty.Expert:
        this.context.board = new Minesweeper(20, 28, 99);
        break;
    }

    this.resize();

  }

  get board(): Minesweeper { return this.context.board; }

  get cellSize(): number { return this._cellSize; }

  get minesCount(): number {
    let b = this.context.board;
    return b.minesCount - b.cells.filter(c => c.flag).length;
  }

  ngOnInit() {
    this.newGame(Difficulty.Beginner);
  }

  startTimer() {
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
    }
    this._timeInterval = setInterval(this.timeTick.bind(this), 1000);
  }

  stopTimer() {
    clearInterval(this._timeInterval);
    this._timeInterval = null;
  }

  autoDiscover(cell: Cell) {
    if (!cell.discovered)
      this.board.discover(cell.x, cell.y);
  }

  discover(cell: Cell) {

    if (this.context.gameState !== GameState.Playing)
      return;

    if (!cell.discovered) {

      if (!this._timeInterval)
        this.startTimer();

      this.board.discover(cell.x, cell.y);

      if (cell.mine) {
        this.gameOver(false);
      } else {
        // Victory condition
        let b = this.context.board;
        if (b.cells.filter(c => c.discovered && !c.mine).length === b.width * b.height - b.minesCount) {
          this.gameOver(true);
        }
      }
    }
  }

  flag(cell: Cell, evt: Event) {

    evt.preventDefault();

    if (this.context.gameState !== GameState.Playing)
      return;

    let count = this.minesCount;

    if (cell.flag) {
      cell.flag = false;
    } else if (count > 0) {
      cell.flag = true;
    }
  }

  checker(cell: Cell): number {
    return (cell.x % 2 + cell.y % 2) % 2;
  }

  private timeTick(): void {
    this.time++;
    if (this.time === 999) { // Time's up
      this.gameOver(false);
    }
  }

  private leadingZeroes(x: number, z: number = 3) {
    let s: string = "" + Math.round(x);
    while (s.length < z) s = "0" + s;
    return s;
  }

  private resize(): void {
    let s = this.getDisplaySize();
    this._cellSize = Math.floor(Math.min(s.width / this.context.board.width, s.height / this.context.board.height));
  }

  private getDisplaySize(): { width: number, height: number, ratio: number } {
    let h = window.innerHeight - paddingUD * 2;
    let w = window.innerWidth - paddingLR * 2;
    return { width: w, height: h, ratio: w / h };
  }

  @HostListener("window:resize", [])
  onResize() {
    this.resize();
  }

}
