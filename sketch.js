// defines number of notches on the axis
const vgrid = 11.0; //vertical - time
const hgrid = 21.0; //horizontal - space

// defines borders
const borders = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

// defines size of notches
const notchr = 10;

// defines colours
let colors = {}

// defines grid size
let grid = {
  winw: null,
  winh: null,
  wspace: null,
  hspace: null,
};

const observers = [];

function setup() {
  createCanvas(1200, 600);

  //
  colors = {
    red: color("red"),
    green: color("green"),
    blue: color("blue"),
    grey: color("grey"),
    black: color("black"),
    yellow: color("yellow"),
  }

  //
  grid.winw = width - borders.left - borders.right;
  grid.winh = height - borders.top - borders.bottom;
  grid.wspace = grid.winw / (hgrid - 1);
  grid.hspace = grid.winh / (vgrid - 1);

  // initialises observers
  observers.push(new Observer(colors.red, 0, true));
  observers.push(new Observer(colors.green, 0.5, false));
  observers.push(new Observer(colors.blue, -0.25, false));

  noLoop();
}

function draw() {
  background(255);

  center();

  lightlines();

  for (const observer of observers) {
    observer.show();
  }
}

function center() {
  // Flip y axis
  scale(1, -1);

  // Move to bottom middle
  translate(width / 2, borders.bottom - height);
}

function lightlines() {
  stroke(colors.yellow);
  strokeWeight(5);
  line(0, 0, height, height - 20);
  line(0, 0, -height, height - 20);
}

/**
 *
 */
class Observer {
  constructor(color, speed, showGrid) {
    this.color = color;
    this.speed = speed;
    this.showGrid = showGrid;
  }

  trans(speed) {
    const theta = speed * (PI / 4);
    const b = tan(theta);
    const gamma = 1 / sqrt(1 - b * b);

    applyMatrix(gamma, -gamma * b, -gamma * b, gamma, 0, 0); // p5JS
  }

  drawGrid() {
    const { winw, winh, wspace, hspace } = grid;

    // draw grid.
    stroke(colors.black);
    strokeWeight(4);

    //
    for (let i = 0; i < vgrid; i++) {
      for (let j = 0; j < hgrid; j++) {
        const x = j * wspace - winw / 2;
        const y = i * hspace;
        point(x, y);
      }
    }

    // draw grid lines.
    stroke(colors.grey);
    strokeWeight(1);

    // Rows
    for (let i = 0; i < vgrid; i++) {
      line(-winw / 2, i * hspace, winw / 2, i * hspace);
    }
  }

  show() {
    const { winw, winh, wspace, hspace } = grid;

    push();

    //
    this.trans(this.speed);

    //
    if (this.showGrid) {
      this.drawGrid();
    }

    //
    const observer = createVector(0, winh);
    observer.div(vgrid - 1);

    stroke(this.color);

    //
    for (let i = 0; i < vgrid - 1; i++) {
      strokeWeight(2);

      line(
        observer.x * i,
        observer.y * i,
        observer.x * (i + 1),
        observer.y * (i + 1)
      );

      //  strokeWeight(2);
      // rect(observer.x*i-15, observer.y*i-15, 30, 30);
      strokeWeight(8);
      point(observer.x * i, observer.y * i);
    }

    pop();
  }
}
