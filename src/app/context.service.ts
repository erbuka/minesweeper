import { Injectable } from '@angular/core';
import { Minesweeper } from 'src/classes/mine-sweeper';

export enum GameState {
  Menu = "menu",
  Playing = "playing",
  GameOver = "gameover"
}

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  board: Minesweeper = null;
  gameState: GameState = GameState.Menu;
  victory: boolean = false;
  constructor() { }
}
