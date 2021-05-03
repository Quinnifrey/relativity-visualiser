/**
 *
 */
class Observer {
  constructor(color, speed, showGrid) {
    this.color = color;
    this.speed = speed;
    this.showGrid = showGrid;
  }
}

// Setup...
document.addEventListener("DOMContentLoaded", function (event) {
  setupSketchOptions();
  addObservers();

  //
  console.log("Setting up sketch...");
  window.sketch = new p5(relativitySketchConstructor, "sketch");

  //
  console.log("Setting up event listeners...");
  setupEventListeners(sketch);
});

/**
 *
 */
function setupSketchOptions() {
  //
  const observers = [];
  let activeObservers = new Set();
  let currentObserver = null;

  //
  window.sketchOptions = {
    observers,
    activeObservers,
    currentObserver,
  };
}

/**
 *
 */
function addObservers() {
  const { observers } = window.sketchOptions;

  observers.push(new Observer("red", 0, true));
  observers.push(new Observer("green", 0.5, false));
  observers.push(new Observer("blue", -0.25, false));
}

/**
 *
 */
function setupEventListeners() {
  document.getElementById("backButton").addEventListener("click", () => {
    // alert("BACK");
  });
}
