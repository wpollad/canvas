class Game {
    constructor() {
        this.cnv = document.querySelector('canvas');
        this.ctx = this.cnv.getContext('2d');

        this.fixedStartPosition = [[1, 1], [2, 2], [2, 3], [3, 1], [3, 2]];

        // фиксированная позиция или рандомно
        this.isFixedStartPosition = false;

        this.column = 40;
        this.speed = 3;

        this.setCanvasSize();
        this.setSize();
        this.drawGame();

        this.gameAnimation();
        onresize = () => {
            this.setCanvasSize();
            this.setSize();
            this.drawGame();

        }
    }
    setCanvasSize() {
        this.w = this.cnv.width = innerWidth;
        this.h = this.cnv.height = innerHeight;
    }
    setSize() {
        this.size = this.w / this.column;
        this.row = Math.trunc(this.h / this.size);
    }

    drawGame() {
        this.field = new Field(this.size, this.row, this.column, this.fixedStartPosition);
        if (this.isFixedStartPosition) {
            this.field.setStartPosition(this.fixedStartPosition);
        } else {
            this.field.setRandomStartPosition();
        }
        this.field.draw(this.ctx);
    }

    gameAnimation() {
        this.field.draw(this.ctx);
        this.field.createNextField();
        this.field.changeField();

        setTimeout(() => {
            this.gameAnimation();
        }, 1000 / this.speed);
    }
}

class Field {
    constructor(size, row, column) {
        this.row = row;
        this.column = column;
        this.size = size;
        this.field = [];
        for (let i = 0; i < column; i++) {
            this.field[i] = [];
            for (let j = 0; j < row; j++) {
                this.field[i][j] = new Cell(i * size, j * size, size, false);
            }
        }
    }

    setRandomStartPosition() {
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                this.field[i][j] = new Cell(i * this.size, j * this.size, this.size, Math.random() > 0.5);
            }
        }
    }

    setStartPosition(startPosition) {
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                startPosition.forEach(([x, y]) => {
                    if (i === x && j === y) {
                        this.field[i][j] = new Cell(i * this.size, j * this.size, this.size, true);
                    }
                })
            }
        }
    }

    createNextField() {
        this.nextField = [];

        for (let i = 0; i < this.column; i++) {
            this.nextField[i] = [];
            for (let j = 0; j < this.row; j++) {
                let count = 0;

                if (i > 0 && j > 0) {
                    if (this.field[i - 1][j - 1].isLife) {
                        count++;
                    }
                }
                if (i > 0) {
                    if (this.field[i - 1][j].isLife) {
                        count++;
                    }
                }
                if (i > 0 && j < this.row - 1) {
                    if (this.field[i - 1][j + 1].isLife) {
                        count++;
                    }
                }
                if (j > 0) {
                    if (this.field[i][j - 1].isLife) {
                        count++;
                    }
                }
                if (j < this.row - 1) {
                    if (this.field[i][j + 1].isLife) {
                        count++;
                    }
                }
                if (i < this.column - 1 && j > 0) {
                    if (this.field[i + 1][j - 1].isLife) {
                        count++;
                    }
                }
                if (i < this.column - 1) {
                    if (this.field[i + 1][j].isLife) {
                        count++;
                    }
                }
                if (i < this.column - 1 && j < this.row - 1) {
                    if (this.field[i + 1][j + 1].isLife) {
                        count++;
                    }
                }

                if (this.field[i][j].isLife) {
                    if (count < 2 || count > 3) {
                        this.nextField[i][j] = new Cell(i * this.size, j * this.size, this.size, false);
                    } else {
                        this.nextField[i][j] = new Cell(i * this.size, j * this.size, this.size, true);
                    }
                } else {
                    if (count === 3) {
                        this.nextField[i][j] = new Cell(i * this.size, j * this.size, this.size, true);
                    } else {
                        this.nextField[i][j] = new Cell(i * this.size, j * this.size, this.size, false);
                    }
                }
            }
        }
    }

    changeField() {
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                this.field[i][j] = this.nextField[i][j];
            }
        }
    }


    draw(ctx) {
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                this.field[i][j].draw(ctx);
            }
        }
    }
}

class Cell {
    constructor(x, y, size, isLife) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isLife = isLife;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        if (this.isLife) {
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#fff';
        } else {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
        }
        ctx.fill();
        ctx.stroke();
    }
}

onload = () => new Game();