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

  //
  console.log('Setting up sketch...');

  let sketch = new p5(relativitySketch, "sketch");

  //
  console.log('Setting up event listeners...');
  setupEventListeners(sketch);

});

/**
 *
 * @param {*} params
 */
function setupSketchOptions(params) {
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
function setupEventListeners() {
  document.getElementById("backButton").addEventListener("click", () => {
    alert("BACK");
  });
}
