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

// Setup when resources have loaded.
window.addEventListener("load", function (event) {
  // Setup global sketch options.
  const options = setupSketchOptions();
  addObservers(options);

  // Setup Vue instance.
  setupControls(options);

  // Initialize P5.js...
  console.log("Setting up sketch...");
  window.sketch = new p5(relativitySketchConstructor, "sketch");
});

/**
 *
 */
function setupSketchOptions() {
  //
  const observers = [];
  let currentObserverIndex = 0;
  // let activeObservers = new Set();

  let perspectiveSpeed = 0;
  let targetPerspectiveSpeed = 0;

  // React to property changes.
  const options = Vue.observable({
    observers,
    currentObserverIndex,
    // activeObservers,

    perspectiveSpeed,
    targetPerspectiveSpeed,
  });

  // Add options object to window.
  window.sketchOptions = options;

  //
  return options;
}

/**
 *
 */
function addObservers(options) {
  const { observers } = options;

  observers.push(new Observer("red", 0, true));
  observers.push(new Observer("green", 0.8, false));
  observers.push(new Observer("blue", -0.25, false));
}

/**
 *
 */
function setupControls(options) {
  // Register main controls component.
  Vue.component("sketch-controls", {
    computed: {
      observer() {
        let { observers, currentObserverIndex } = options;

        // Get current observer.
        const observer = observers[currentObserverIndex];

        return observer;
      },

      observerSelected: {
        get() {
          return options.currentObserverIndex;
        },
        set(value) {
          options.currentObserverIndex = value;
        },
      },

      //
      observersOptions() {
        const { observers } = options;

        return observers.map((_observer, index) => {
          return {
            value: index,
            text: `Observer #${index + 1}`,
          };
        });
      },
    },

    methods: {
      previousObserver() {
        let { observers, currentObserverIndex } = options;

        //
        const lastIndex = observers.length - 1;

        // Decrement index if current is greater than 0,
        // or jump forward to last observer index.
        const index =
          currentObserverIndex > 0 ? currentObserverIndex - 1 : lastIndex;

        options.currentObserverIndex = index;
      },

      nextObserver() {
        let { observers, currentObserverIndex } = options;

        //
        const lastIndex = observers.length - 1;

        // Increment index if current is smaller than the last observer index,
        // or jump back to 0.
        const index =
          currentObserverIndex < lastIndex ? currentObserverIndex + 1 : 0;

        options.currentObserverIndex = index;
      },
    },
  });

  Vue.component("observer-details", {
    computed: {
      observer() {
        let { observers, currentObserverIndex } = options;

        // Get current observer.
        const observer = observers[currentObserverIndex];

        return observer;
      },
      relativeSpeed() {
        let { observers, currentObserverIndex, perspectiveSpeed } = options;

        const speed =
          (this.observer.speed + perspectiveSpeed) /
          (1 + this.observer.speed * perspectiveSpeed);

        return speed.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
      },
    },
    methods: {
      matchSpeed() {
        const { observers, currentObserverIndex } = options;

        // Update sketch data.
        options.targetPerspectiveSpeed = -this.observer.speed;
      },
    },
  });

  // Create Vue instance.
  var app = new Vue({
    el: "#app",
    data: {
      message: "Hello Vue!",
    },
  });
}
