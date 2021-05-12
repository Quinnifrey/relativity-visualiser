/**
 *
 */
class Observer {
  constructor(spriteIndex, speed, showGrid) {
    this.spriteIndex = spriteIndex;
    this.speed = speed;
    this.showGrid = showGrid;
  }

  color() {
    return prefabs[this.spriteIndex % prefabs.length][1];
  }

  spriteUrl() {
    return prefabs[this.spriteIndex % prefabs.length][2];
  }
}

/**
 *
 */
function absoluteToRelativeSpeed(absoluteSpeed, perspectiveSpeed) {
  const speed =
    (absoluteSpeed + perspectiveSpeed) / (1 + absoluteSpeed * perspectiveSpeed);

  return speed;
}

function relativeToAbsoluteSpeed(relativeSpeed, perspectiveSpeed) {
  const speed =
    (relativeSpeed - perspectiveSpeed) / (1 - relativeSpeed * perspectiveSpeed);

  return speed;
}

function gamma(relativeSpeed) {
  const theta = relativeSpeed * (Math.PI / 4);
  const b = Math.tan(theta);
  const gamma = 1 / Math.sqrt(1 - b * b);

  return gamma;
}

/**
 *
 */
const palette = [
  "red",
  "green",
  "purple",
  "blue",
  "grey",
  "black",
  "yellow",
  "white",
];

//
const sprites = [
  "https://quinnifrey.github.io/relativity-visualiser/Rocket.png",
  "https://quinnifrey.github.io/relativity-visualiser/tacocat.png",
  "https://quinnifrey.github.io/relativity-visualiser/spacedude.png",
];

// //
const prefabs = [
  ["Rocket", palette[0], sprites[0]],
  ["TacoCat", palette[1], sprites[1]],
  ["SpaceDude", palette[2], sprites[2]],
];

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
  //let currentColorIndex = 0;
  // let activeObservers = new Set();

  let perspectiveSpeed = 0;
  let targetPerspectiveSpeed = 0;

  // React to property changes.
  const options = Vue.observable({
    observers,
    currentObserverIndex,
    // activeObservers,
    //currentColorIndex,
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

  observers.push(new Observer(0, 0.5, true));
  observers.push(new Observer(1, 0, true));
  observers.push(new Observer(2, -0.25, false));
}

/**
 *
 */
function setupControls(options) {
  // Enable development tools.
  Vue.config.devtools = true;

  // Register main controls component.
  Vue.component("sketch-controls", {
    // computed: {
    //   observer() {
    //     let { observers, currentObserverIndex } = options;

    //     // Get current observer.
    //     const observer = observers[currentObserverIndex];

    //     return observer;
    //   },
    // },

    methods: {
      // previousObserver() {
      //   let { observers, currentObserverIndex } = options;

      //   //
      //   const lastIndex = observers.length - 1;

      //   // Decrement index if current is greater than 0,
      //   // or jump forward to last observer index.
      //   const index =
      //     currentObserverIndex > 0 ? currentObserverIndex - 1 : lastIndex;

      //   options.currentObserverIndex = index;
      // },

      // nextObserver() {
      //   let { observers, currentObserverIndex } = options;

      //   //
      //   const lastIndex = observers.length - 1;

      //   // Increment index if current is smaller than the last observer index,
      //   // or jump back to 0.
      //   const index =
      //     currentObserverIndex < lastIndex ? currentObserverIndex + 1 : 0;

      //   options.currentObserverIndex = index;
      // },

      addObserver() {
        let { perspectiveSpeed } = options;

        //
        const input = window.prompt(
          `Observer speed relative to your current reference frame `,
          0
        );
        const relativeSpeed = parseFloat(input);

        if (
          isNaN(relativeSpeed) ||
          relativeSpeed < -0.999 ||
          relativeSpeed > 0.999
        ) {
          alert(`Speed must be between -0.999 and +0.999`);
          return;
        }

        const speed = relativeToAbsoluteSpeed(-relativeSpeed, perspectiveSpeed);

        const spriteIndexes = options.observers.map(
          (observer) => observer.spriteIndex
        );

        let i = 0;
        do {
          i = i + 1;
        } while (spriteIndexes.includes(i));

        options.observers.push(new Observer(i, speed, false));
      },
    },
  });

  /**
   *
   */
  Vue.component("observers-table", {
    props: {
      // current: {
      //   type: Object,
      //   required: true,
      // },
    },

    computed: {
      observers() {
        return options.observers;
      },
    },
  });

  Vue.component("observers-table-row", {
    template: "#observers-table-row-template",
    props: {
      observer: {
        type: Object,
        required: true,
      },
      // index: {
      //   type: Number,
      //   required: true,
      // },
    },

    // mounted() {
    //   console.log(this.gamma);
    // },

    computed: {
      relativeSpeed() {
        let { perspectiveSpeed } = options;

        return (
          0 -
          absoluteToRelativeSpeed(
            this.observer.speed,
            perspectiveSpeed
          ).toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        );
      },

      gamma() {
        return gamma(this.relativeSpeed).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
      },
    },
    methods: {
      matchSpeed() {
        //const { observers, currentObserverIndex } = options;

        // Update sketch data.
        options.targetPerspectiveSpeed = -this.observer.speed;
      },
      changeSpeed() {
        let { perspectiveSpeed } = options;

        //
        const input = window.prompt(
          `Observer speed relative to your current reference frame `,
          0
        );

        const relativeSpeed = parseFloat(input);

        if (
          isNaN(relativeSpeed) ||
          relativeSpeed < -0.999 ||
          relativeSpeed > 0.999
        ) {
          alert(`Speed must be between -0.999 and +0.999`);
          return;
        }

        const speed = relativeToAbsoluteSpeed(-relativeSpeed, perspectiveSpeed);

        this.observer.speed = speed;
      },
      deleteObserver() {
        const index = options.observers.indexOf(this.observer);
        const confirmed = window.confirm(
          "Are you sure you want to delete Observer #" + (index + 1)
        );

        if (confirmed) {
          options.observers.splice(index, 1);
        }
      },
    },
  });

  /**
  //  *
  //  */
  // Vue.component("observer-select", {
  //   props: {
  //     observer: {
  //       type: Object,
  //       required: true,
  //     },
  //   },

  //   computed: {
  //     observerSelected: {
  //       get() {
  //         return options.currentObserverIndex;
  //       },
  //       set(value) {
  //         options.currentObserverIndex = value;
  //       },
  //     },

  //     //
  //     observersOptions() {
  //       const { observers } = options;

  //       return observers.map((_observer, index) => {
  //         return {
  //           value: index,
  //           text: `Observer #${index + 1}`,
  //         };
  //       });
  //     },
  //   },
  // });

  // Vue.component("observer-details", {
  //   props: {
  //     observer: {
  //       type: Object,
  //       required: true,
  //     },
  //   },
  //   computed: {
  //     absoluteToRelativeSpeed() {
  //       let { perspectiveSpeed } = options;

  //       const speed =
  //         0 - absoluteToRelativeSpeed(this.observer.speed, perspectiveSpeed);

  //       const bigSpeed = Math.floor(1000 * speed);
  //       const smolSpeed = bigSpeed / 1000;

  //       //return smolSpeed;
  //       // return decimalAdjust("floor",speed,-3)
  //       return smolSpeed.toLocaleString(undefined, {
  //         minimumFractionDigits: 3,
  //         maximumFractionDigits: 3,
  //       });
  //     },
  //     // relativeToAbsoluteSpeed(input) {
  //     //   let { perspectiveSpeed } = options;
  //     //   const speed =
  //     //     (input - perspectiveSpeed) / (1 - input * perspectiveSpeed);
  //     //   return speed;
  //     // },
  //     gamma() {
  //       let { perspectiveSpeed } = options;

  //       return gamma(perspectiveSpeed).toLocaleString(undefined, {
  //         minimumFractionDigits: 3,
  //         maximumFractionDigits: 3,
  //       });
  //     },
  //   },
  //   methods: {
  //     matchSpeed() {
  //       const { observers, currentObserverIndex } = options;

  //       // Update sketch data.
  //       options.targetPerspectiveSpeed = -this.observer.speed;
  //     },
  //     changeSpeed() {
  //       let { perspectiveSpeed } = options;

  //       //
  //       const input = window.prompt(
  //         `Observer speed relative to your current reference frame `,
  //         0
  //       );

  //       const relativeSpeed = parseFloat(input);

  //       if (
  //         isNaN(relativeSpeed) ||
  //         relativeSpeed < -0.999 ||
  //         relativeSpeed > 0.999
  //       ) {
  //         alert(`Speed must be between -0.999 and +0.999`);
  //         return;
  //       }

  //       const speed = relativeToAbsoluteSpeed(-relativeSpeed, perspectiveSpeed);

  //       this.observer.speed = speed;
  //     },
  //   },
  // });

  // Create Vue instance.
  var app = new Vue({
    el: "#app",
    data: {},
  });
}
