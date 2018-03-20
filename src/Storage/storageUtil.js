export function save(id, value) {
  window.localStorage.setItem(id, JSON.stringify(value));
  return value;
}

export function load(id) {
  return JSON.parse(window.localStorage.getItem(id));
}

export function loadState() {
  if (!load("lastVisited")) {
    initializeStorageState();
  }
  return initializeState();
}


export function initializeStorageState() {
  save("lastVisited", new Date());

  save("LOC", {
    allTimeValue: 0,
    currentValue: 0,
    disabledTime: 1,
  });

  save("NOK", {
    allTimeValue: 0,
    currentValue: 0,
    disabledTime: 5,
  });

  save("INTERN", {
    allTimeValue: 0,
    currentValue: 0,
    disabledTime: 15,
  });
}

export function updateLocalStorage(state) {
  save("LOC", state["LOC"].localStorage);
  save("NOK", state["NOK"].localStorage);
  save("INTERN", state["INTERN"].localStorage);
}

export function initializeState() {
  return {
    "LOC": {
      id: "LOC",
      title: "Develop",
      scoreLabel: "LOC",
      logMessage: "Developers, developers, developers..",
      isButton: true,
      localStorage: load("LOC"),
      disabledTime: load("LOC").disabledTime,
      hasTickFunction: false,
      isButtonDisplayed: () => {
        return true;
      },
      isButtonEnabled: () => {
        return true;
      },
      clickFunction: (state, updateCallback) => {
        state["LOC"].localStorage.currentValue += 1;
        state["LOC"].localStorage.allTimeValue += 1;
        updateCallback(state["LOC"].logMessage, state);

      },
      tickFunction: () => {

      }
    },
    "NOK": {
      id: "NOK",
      title: "Sell software (10 LOC)",
      scoreLabel: "NOK",
      logMessage: "You sell software to unsuspecting customers" ,
      isButton: true,
      localStorage: load("NOK"),
      disabledTime: load("NOK").disabledTime,
      hasTickFunction: false,
      isButtonDisplayed: (state) => {
        return state["LOC"].localStorage.allTimeValue >= 10;
      },
      isButtonEnabled: (state) => {
        return state["LOC"].localStorage.currentValue >= 10;
      },
      clickFunction: (state, updateCallback) => {
        state["NOK"].localStorage.currentValue += 1000;
        state["NOK"].localStorage.allTimeValue += 1000;
        state["LOC"].localStorage.currentValue -= 10;
        updateCallback(state["NOK"].logMessage, state);
      },
      tickFunction: () => {

      }
    },
    "INTERN": {
      id: "INTERN",
      title: "Hire summer intern",
      scoreLabel: "Summer interns",
      logMessage: "To the java mines code monkey!",
      isButton: true,
      localStorage: load("INTERN"),
      disabledTime: load("INTERN").disabledTime,
      hasTickFunction: true,
      isButtonDisplayed: (state) => {
        return state["NOK"].localStorage.allTimeValue >= 5000;
      },
      isButtonEnabled: (state) => {
        return state["NOK"].localStorage.currentValue >= 5000;
      },
      clickFunction: (state, updateCallback) => {
        state["INTERN"].localStorage.currentValue += 1;
        state["INTERN"].localStorage.allTimeValue += 1;
        state["NOK"].localStorage.currentValue -= 5000;
        updateCallback(state["INTERN"].logMessage, state);
        },
      tickFunction: (state) => {
        state["LOC"].localStorage.currentValue += 1 * state["INTERN"].localStorage.currentValue ;
        state["LOC"].localStorage.allTimeValue += 1 * state["INTERN"].localStorage.currentValue ;
      }
    },
  };
}
