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

// defines main sketch margin
const margin = 40;

const spacebarHeight = 80;

// defines size of notches
const notchr = 10;

const perspectiveAcceleration = 0.01;

// defines grid size
const grid = {
  windowHeight: null,
  gap: null,
};

// Sketch colors.
const colors = {
  point: "black",
  lines: "grey",
  axis: "black",
  axisText: "black",
  spacebar: "black",
  light: "#ffaa00",
  mask: "rgba(255,255,255, .8)",
};

/**
 * P5.js constructor used to create sketch in instance mode.
 *
 * @see https://p5js.org/reference/#/p5/p5
 */
const relativitySketchConstructor = (sketch) => {
  //sketch.preload = () => {};

  // Map of sprite URLs pointing to loaded images.
  const loadedSprites = new Map();

  // Load image if not already in map.
  const getSprite = (url) => {
    if (!loadedSprites.has(url)) {
      // Image hasn't been loaded yet...
      const image = sketch.loadImage(url);
      loadedSprites.set(url, image);
    }

    return loadedSprites.get(url);
  };

  //
  sketch.setup = () => {
    // initialises observers
    const { observers } = window.sketchOptions;

    //
    sketch.createCanvas(1200, 600 + margin + spacebarHeight); // Adding margin forces the margin to be equal on all sides

    //

    grid.windowHeight = sketch.height - margin * 2 - spacebarHeight;
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
    drawSpacebar();
  };

  function center() {
    // Flip y axis
    sketch.scale(1, -1);

    // Move to bottom middle
    sketch.translate(sketch.width / 2, margin + spacebarHeight - sketch.height);
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
    sketch.stroke(colors.light);
    sketch.strokeWeight(5);
    sketch.line(0, 0, grid.windowHeight + margin, grid.windowHeight + margin);
    sketch.line(0, 0, -grid.windowHeight - margin, grid.windowHeight + margin);
  }

  function drawMask() {
    sketch.strokeWeight(0);
    sketch.fill(colors.mask);

    sketch.beginShape();
    sketch.vertex(0, 0);
    sketch.vertex(sketch.width / 2, sketch.height - margin - spacebarHeight);
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
    sketch.stroke(colors.axis);
    sketch.fill(colors.axisText);
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

    sketch.translate(
      sketch.width / 2,
      sketch.height - (spacebarHeight + margin / 2)
    );

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

    sketch.text(
      "Space",
      sketch.width / 2,
      sketch.height - (spacebarHeight + margin / 2)
    );
  }

  function drawSpacebar() {
    sketch.stroke(colors.spacebar);
    sketch.strokeWeight(2);
    sketch.imageMode(sketch.CENTER);

    const { observers, perspectiveSpeed } = window.sketchOptions;

    sketch.push();

    const transformMatrix = lorentzTransform(perspectiveSpeed);
    //console.log(transformMatrix)

    // console.log(transformMatrix[0],
    //   0,
    //   transformMatrix[2],
    //   0,
    //   transformMatrix[4],
    //   0)
    sketch.translate(sketch.width / 2, sketch.height - spacebarHeight / 2);
    sketch.line(-grid.windowHeight, 0, grid.windowHeight, 0);



    for (const observer of observers) {
      const speed = absoluteToRelativeSpeed(observer.speed, perspectiveSpeed);

      sketch.push();
      sketch.translate(-speed * grid.windowHeight,0)
      
      sketch.applyMatrix(1/lorentzTransform(speed)[0],0,0,1,0,0)

      sketch.image(
        getSprite(observer.spriteUrl()),
        0,
        0
      );
      sketch.pop()
    }

    sketch.pop();
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
    sketch.stroke(colors.point);
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
    sketch.stroke(colors.lines);
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

    sketch.stroke(observer.color());

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
    sketch.scale(1, -1);
    sketch.imageMode(sketch.CENTER);

    for (let i = 1; i < gridNotches; i++) {
      //sketch.point(vector.x * i, vector.y * i);
      //sketch.strokeWeight(0)
      //sketch.fill(observer.color)
      //sketch.rect(vector.x * i - 20, vector.y * i - 20,40,40);
      sketch.image(
        getSprite(observer.spriteUrl()),
        vector.x * i,
        -vector.y * i
      );
    }
    sketch.pop();
    //
    sketch.pop();
  }
};
