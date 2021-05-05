/**
 * Applies lorentz transform
 *
 *  (a,b,c,d,e,f)
 *
 *  [ a c e ]
 *  [ b d f ]
 *
 * @param {object} sketch
 * @param {Number} speed
 */
function lorentzTransform(speed) {
  const theta = speed * (Math.PI / 4);
  const b = Math.tan(theta);
  const gamma = 1 / Math.sqrt(1 - b * b);

  return [gamma, -gamma * b, -gamma * b, gamma, 0, 0];
}

// defines number of notches on the axis
const gridNotches = 6.0; //vertical - time

// defines margin
const margin = 40;

// defines size of notches
const notchr = 10;

const perspectiveAcceleration = 0.01;

// defines colours
let colors = {};

// defines grid size
const grid = {
  windowHeight: null,
  gap: null,
};

/**
 * P5.js constructor used to create sketch in instance mode.
 *
 * @see https://p5js.org/reference/#/p5/p5
 */
const relativitySketchConstructor = (sketch) => {
  // sketch.preload = () => {
  // };
  const tacocat = sketch.loadImage(
    "https://kauhat.github.io/relativity-visualiser/tacocat.png"
  );

  sketch.setup = () => {
    // initialises observers
    const { observers } = window.sketchOptions;

    //
    sketch.createCanvas(1200, 600 + margin); // Adding margin forces the margin to be equal on all sides

    //
    colors = {
      red: sketch.color("red"),
      green: sketch.color("green"),
      blue: sketch.color("blue"),
      grey: sketch.color("grey"),
      black: sketch.color("black"),
      yellow: sketch.color("yellow"),
      white: sketch.color("white"),
    };

    //

    //
    grid.windowHeight = sketch.height - margin * 2;
    grid.gap = grid.windowHeight / (gridNotches - 1);

    //
    //sketch.noLoop();
  };

  sketch.draw = () => {
    sketch.background(255);


    sketch.push();
    center();


    sketch.push();

    // check active observer

    applyPerspective();

    //
    const { observers } = window.sketchOptions;
    for (const observer of observers) {
      drawObserver(observer);
    }

    sketch.pop();


    drawLightlines();

    sketch.pop();
    drawMask();
    drawAxesMarkers();
  };

  function center() {
    // Flip y axis
    sketch.scale(1, -1);

    // Move to bottom middle
    sketch.translate(sketch.width / 2, margin - sketch.height);
  }

  function applyPerspective() {
    let { perspectiveSpeed, targetPerspectiveSpeed } = window.sketchOptions;
    sketch.applyMatrix(lorentzTransform(perspectiveSpeed));

    if (
      Math.abs(targetPerspectiveSpeed - perspectiveSpeed) <
      perspectiveAcceleration
    ) {
      perspectiveSpeed = targetPerspectiveSpeed;
    } else if (targetPerspectiveSpeed > perspectiveSpeed) {
      perspectiveSpeed += perspectiveAcceleration;
    } else if (targetPerspectiveSpeed < perspectiveSpeed) {
      perspectiveSpeed -= perspectiveAcceleration;
    } else {
      console.warn("This should never happen");
    }

    window.sketchOptions.perspectiveSpeed = perspectiveSpeed;
  }

  function drawLightlines() {
    sketch.stroke(colors.yellow);
    sketch.strokeWeight(5);
    sketch.line(0, 0, grid.windowHeight + margin, grid.windowHeight + margin);
    sketch.line(0, 0, -grid.windowHeight - margin, grid.windowHeight + margin);
  }

  function drawMask() {
    sketch.strokeWeight(0);
    sketch.fill("rgba(255,255,255, .8)");


    sketch.beginShape();
    sketch.vertex(0, 0);
    sketch.vertex(sketch.width/2,sketch.height-margin);
    sketch.vertex(sketch.width, 0);
    sketch.vertex(sketch.width, sketch.height);
    sketch.vertex(0, sketch.height);
    sketch.endShape(sketch.CLOSE);

    // sketch.triangle(
    //   +margin / 4,
    //   -margin / 4,
    //   -grid.windowHeight - margin / 4,
    //   grid.windowHeight + margin / 4,
    //   -grid.windowHeight - margin / 4,
    //   -margin / 4
    // );
  }

  function drawAxesMarkers() {
    sketch.stroke(colors.black);
    sketch.fill(colors.black);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textSize(margin / 2);

    sketch.strokeWeight(2);

    sketch.push();

    sketch.translate(margin / 2, sketch.height / 2);
    // Top time line
    sketch.line(0, -sketch.height / 4, 0, -margin);
    // Time arrow left
    sketch.line(
      0,
      -sketch.height / 4,
      -margin / 4,
      (-sketch.height + margin) / 4
    );
    // Time arrow right
    sketch.line(
      0,
      -sketch.height / 4,
      margin / 4,
      (-sketch.height + margin) / 4
    );
    // Bottom time line
    sketch.line(0, sketch.height / 4, 0, margin);
    sketch.pop();

    sketch.push();

    sketch.translate(sketch.width / 2, sketch.height - margin / 2);

    // Left space line
    sketch.line(-sketch.width / 4, 0, -margin, 0);
    // Left up arrow
    sketch.line(-sketch.width / 4, 0, (margin - sketch.width) / 4, -margin / 4);
    // Left down arrow
    sketch.line(-sketch.width / 4, 0, (margin - sketch.width) / 4, margin / 4);

    // Right space line
    sketch.line(sketch.width / 4, 0, margin, 0);
    // Right up arrow
    sketch.line(sketch.width / 4, 0, (-margin + sketch.width) / 4, -margin / 4);
    // Right down arrow
    sketch.line(sketch.width / 4, 0, (-margin + sketch.width) / 4, margin / 4);

    sketch.pop();

    sketch.strokeWeight(0);

    sketch.push();
    sketch.rotate(-sketch.HALF_PI);
    sketch.text("Time", -sketch.height / 2, margin / 2);
    sketch.pop();

    sketch.text("Space", sketch.width / 2, sketch.height - margin / 2);
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

    sketch.applyMatrix(lorentzTransform(observer.speed));

    //const { winw, winh, wspace, hspace } = grid;

    // draw grid.
    sketch.stroke(colors.black);
    sketch.strokeWeight(4);

    //
    for (let i = 0; i < gridNotches; i++) {
      for (let j = 1 - gridNotches; j < gridNotches; j++) {
        const x = j * grid.gap;
        const y = i * grid.gap;
        sketch.point(x, y);
      }
    }

    // draw grid lines.
    sketch.stroke(colors.grey);
    sketch.strokeWeight(1);

    // Rows
    for (let i = 0; i < gridNotches; i++) {
      sketch.line(
        -grid.windowHeight,
        i * grid.gap,
        grid.windowHeight,
        i * grid.gap
      );
    }

    //
    sketch.pop();
  }

  function drawObserverWorldline(observer) {
    sketch.push();

    sketch.applyMatrix(lorentzTransform(observer.speed));

    //const { winw, winh, wspace, hspace } = grid;

    //
    const vector = sketch.createVector(0, grid.windowHeight);
    vector.div(gridNotches - 1);

    sketch.stroke(observer.color);

    //
    sketch.strokeWeight(2);
    for (let i = 0; i < gridNotches; i++) {
      sketch.line(
        vector.x * i,
        vector.y * i,
        vector.x * (i + 1),
        vector.y * (i + 1)
      );

      //  strokeWeight(2);
      // rect(vector.x*i-15, vector.y*i-15, 30, 30);
    }
    //

    sketch.strokeWeight(8);
    sketch.push();
    sketch.scale(1,-1);
    sketch.imageMode(sketch.CENTER)
    for (let i = 1; i < gridNotches; i++) {
      //sketch.point(vector.x * i, vector.y * i);
      //sketch.strokeWeight(0)
      //sketch.fill(observer.color)
      //sketch.rect(vector.x * i - 20, vector.y * i - 20,40,40);
      sketch.image(tacocat, vector.x * i, - vector.y * i);
    }
    sketch.pop();
    //
    sketch.pop();
  }
};
