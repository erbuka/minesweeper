export enum Difficulty {
    Beginner = 'beginner',
    Intermediate = "intermediate",
    Expert = "expert"
}

export enum ScreenType {
    Portrait = 0,
    Landscape = 1
}

export interface Cell {
    x: number;
    y: number;
    discovered: boolean;
    mine: boolean;
    minesAround: number;
    flag: boolean;
}


export class Minesweeper {

    get cells(): Cell[] { return this._cells; }

    private _cells: Cell[] = null;
    constructor(readonly width: number, readonly height: number, readonly minesCount: number) {
        let indices: number[] = new Array<number>(width * height);
        this._cells = new Array<Cell>(width * height);

        // Init the grid
        for (let i = 0; i < width * height; i++) {
            this._cells[i] = { x: i % width, y: Math.floor(i / width), discovered: false, mine: false, minesAround: 0, flag: false };
            indices[i] = i;
        }

        // Select the mines
        let c = 0;
        while (c < minesCount) {
            let idx = Math.floor(Math.random() * indices.length);
            this._cells[indices[idx]].mine = true;
            indices.splice(idx, 1);
            c++;
        }

        // Compute mines around
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dx !== 0 || dy !== 0) {
                            let cell = this.at(x + dx, y + dy);
                            count += cell && cell.mine ? 1 : 0;
                        }
                    }
                }
                this.at(x, y).minesAround = count;
            }
        }
    }

    discover(x: number, y: number) {
        let cell = this.at(x, y);

        if (!cell || cell.discovered)
            return;

        cell.discovered = true;
        cell.flag = false;

        if (!cell.mine && cell.minesAround === 0) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx !== 0 || dy !== 0) {
                        this.discover(x + dx, y + dy);
                    }
                }
            }
        }
    }

    at(x: number, y: number): Cell {
        let idx = y * this.width + x;
        return x >= 0 && x < this.width && y >= 0 && y < this.height ? this._cells[y * this.width + x] : null;
    }


}