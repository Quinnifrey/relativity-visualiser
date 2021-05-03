/**
 *
 * @param {*} speed
 */
function laplaceTransform(sketch, speed) {
  const theta = speed * (Math.PI / 4);
  const b = Math.tan(theta);
  const gamma = 1 / Math.sqrt(1 - b * b);

  sketch.applyMatrix(gamma, -gamma * b, -gamma * b, gamma, 0, 0); // p5JS
}

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
let colors = {};

// defines grid size
const grid = {
  winw: null,
  winh: null,
  wspace: null,
  hspace: null,
};

/**
 * P5.js constructor used to create sketch in instance mode.
 *
 * @see https://p5js.org/reference/#/p5/p5
 */
const relativitySketchConstructor = (sketch) => {
  sketch.setup = () => {
    // initialises observers
    const { observers } = window.sketchOptions;

    //
    sketch.createCanvas(1200, 600);

    //
    colors = {
      red: sketch.color("red"),
      green: sketch.color("green"),
      blue: sketch.color("blue"),
      grey: sketch.color("grey"),
      black: sketch.color("black"),
      yellow: sketch.color("yellow"),
    };

    //
    grid.winw = sketch.width - borders.left - borders.right;
    grid.winh = sketch.height - borders.top - borders.bottom;
    grid.wspace = grid.winw / (hgrid - 1);
    grid.hspace = grid.winh / (vgrid - 1);

    //
    sketch.noLoop();
  };

  sketch.draw = () => {
    sketch.background(255);

    center();

    drawLightlines();

    //
    const { observers } = window.sketchOptions;
    for (const observer of observers) {
      drawObserver(observer);
    }
  };

  function center() {
    // Flip y axis
    sketch.scale(1, -1);

    // Move to bottom middle
    sketch.translate(sketch.width / 2, borders.bottom - sketch.height);
  }

  function drawLightlines() {
    sketch.stroke(colors.yellow);
    sketch.strokeWeight(5);
    sketch.line(0, 0, grid.winh + borders.right, grid.winh);
    sketch.line(0, 0, -grid.winh - borders.left, grid.winh);
  }

  function drawObserver(observer) {
    //
    if (observer.showGrid) {
      drawObserverGrid(observer);
    }

    //
    drawObserverWorldline(observer);
  }

  function drawObserverGrid(observer) {
    sketch.push();

    laplaceTransform(sketch, observer.speed);

    const { winw, winh, wspace, hspace } = grid;

    // draw grid.
    sketch.stroke(colors.black);
    sketch.strokeWeight(4);

    //
    for (let i = 0; i < vgrid; i++) {
      for (let j = 0; j < hgrid; j++) {
        const x = j * wspace - winw / 2;
        const y = i * hspace;
        sketch.point(x, y);
      }
    }

    // draw grid lines.
    sketch.stroke(colors.grey);
    sketch.strokeWeight(1);

    // Rows
    for (let i = 0; i < vgrid; i++) {
      sketch.line(-winw / 2, i * hspace, winw / 2, i * hspace);
    }

    //
    sketch.pop();
  }

  function drawObserverWorldline(observer) {
    sketch.push();

    laplaceTransform(sketch, observer.speed);

    const { winw, winh, wspace, hspace } = grid;

    //
    const vector = sketch.createVector(0, winh);
    vector.div(vgrid - 1);

    sketch.stroke(observer.color);

    //
    for (let i = 0; i < vgrid - 1; i++) {
      sketch.strokeWeight(2);

      sketch.line(
        vector.x * i,
        vector.y * i,
        vector.x * (i + 1),
        vector.y * (i + 1)
      );

      //  strokeWeight(2);
      // rect(vector.x*i-15, vector.y*i-15, 30, 30);
      sketch.strokeWeight(8);
      sketch.point(vector.x * i, vector.y * i);
    }

    //
    sketch.pop();
  }
};
