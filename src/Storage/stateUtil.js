import {load, save} from "./storageUtil";
import {CURRENT_VERSION, migrate} from "./migrationUtil";

export function loadState() {
  if (!load("lastVisited")) {
    initializeGameStateStorage();
  }

  migrate();
  return initializeState();
}

function isDisplayed(resourceName, state) {
  let resourceStorage = state[resourceName].localStorage;
  let costStorage = state[resourceStorage.cost.name].localStorage;

  return costStorage.value.allTime >= resourceStorage.cost.displayAtValue;
}

function isEnabled(resourceName, state) {
  let resourceStorage = state[resourceName].localStorage;
  let costStorage = state[resourceStorage.cost.name].localStorage;

  return costStorage.value.current >= resourceStorage.cost.amount;
}

export function initializeGameStateStorage() {
  save("lastVisited", new Date());
  save("version", CURRENT_VERSION);

  save("LOC", {
    disabledTime: 1,
    value: {
      current: 0,
      allTime: 0,
      production: 10,
    },
    cost: {
      name: "",
      amount: 0,
      displayAtValue: 0,
    },
  });

  save("NOK", {
    disabledTime: 5,
    value: {
      current: 10000000,
      allTime: 10000000,
      production: 1000,
    },
    cost: {
      name: "LOC",
      amount: 100,
      displayAtValue: 50,
    },
  });

  save("INTERN", {
    disabledTime: 30,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
    },
    cost: {
      name: "NOK",
      amount: 10000,
      displayAtValue: 5000,
    },
    production: {
      amount: 5,
    }
  });

  save("SPAM", {
    disabledTime: 15,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
    },
    cost: {
      name: "NOK",
      amount: 3000,
      displayAtValue: 1500,
    },
    production: {
      cost: 1,
      amount: 10,
    }
  });

  save("INTERNMANAGER", {
    disabledTime: 2 * 60,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
    },
    cost: {
      name: "NOK",
      amount: 50000,
      displayAtValue: 15000,
    },
  });

  save("", {})
}

export function initializeState() {
  return {
    upgradeState: {

    },
    actions: {
      "LOC": {
        id: "LOC",
        title: "Develop",
        tooltipText: "Do some coding",
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
          const locStorage = state.actions["LOC"].localStorage;
          locStorage.value.current += locStorage.value.production;
          locStorage.value.allTime += locStorage.value.production;
          updateCallback(state.actions["LOC"].logMessage, state);
        },
        tickFunction: () => {
        }
      },
      "NOK": {
        id: "NOK",
        title: "Sell software",
        tooltipText: "Sell your software on the free marked™",
        scoreLabel: "NOK",
        logMessage: "You sell software to unsuspecting customers",
        isButton: true,
        localStorage: load("NOK"),
        disabledTime: load("NOK").disabledTime,
        hasTickFunction: false,
        isButtonDisplayed: (state) => {
          return isDisplayed("NOK", state.actions);
        },
        isButtonEnabled: (state) => {
          return isEnabled("NOK", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;
          const locStorage = state.actions["LOC"].localStorage;


          nokStorage.value.current += nokStorage.value.production;
          nokStorage.value.allTime += nokStorage.value.production;

          locStorage.value.current -= nokStorage.cost.amount;

          updateCallback(state.actions["NOK"].logMessage, state);
        },
        tickFunction: () => {
        }
      },
      "SPAM": {
        id: "SPAM",
        title: "Buy spambots",
        tooltipText: "Send illicit spam to sell software",
        scoreLabel: "Spambots",
        logMessage: "I am Dr. Bakare Tunde, the cousin of Nigerian Astronaut, Air Force Major Abacha Tunde..",
        isButton: true,
        localStorage: load("SPAM"),
        disabledTime: load("SPAM").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state) => {
          return isDisplayed("SPAM", state.actions)
        },
        isButtonEnabled: (state) => {
          return isEnabled("SPAM", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const spamStorage = state.actions["SPAM"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;

          spamStorage.value.current += spamStorage.value.production;
          spamStorage.value.allTime += spamStorage.value.production;

          nokStorage.value.current -= spamStorage.cost.amount;

          updateCallback(state.actions["SPAM"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          const spamStorage = state.actions["SPAM"].localStorage;
          const locStorage = state.actions["LOC"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;

          if(spamStorage.value.current !== 0 && locStorage.value.current >= spamStorage.production.cost) {
            let botsThatCanSell = Math.floor(locStorage.value.current/spamStorage.production.cost);
            botsThatCanSell = Math.min(botsThatCanSell, spamStorage.valueOf.current);

            console.log(botsThatCanSell);
            locStorage.value.current -= botsThatCanSell * spamStorage.production.cost;
            nokStorage.value.current += botsThatCanSell * spamStorage.production.amount;
            nokStorage.value.allTime += botsThatCanSell * spamStorage.production.amount;
          }

          updateCallback(null, state);
        }
      },
      "INTERN": {
        id: "INTERN",
        title: "Hire summer intern",
        tooltipText: "Hire a cheap, error prone summer intern.",
        scoreLabel: "Summer interns",
        logMessage: "To the java mines code monkey!",
        isButton: true,
        localStorage: load("INTERN"),
        disabledTime: load("INTERN").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state) => {
          return isDisplayed("INTERN", state.actions)
        },
        isButtonEnabled: (state) => {
          return isEnabled("INTERN", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const internStorage = state.actions["INTERN"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;


          internStorage.value.current += internStorage.value.production;
          internStorage.value.allTime += internStorage.value.production;

          nokStorage.value.current -= internStorage.cost.amount;

          updateCallback(state.actions["INTERN"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          const internStorage = state.actions["INTERN"].localStorage;
          const locStorage = state.actions["LOC"].localStorage;

          locStorage.value.current += internStorage.value.current * internStorage.production.amount;
          locStorage.value.allTime += internStorage.value.current * internStorage.production.amount;

          updateCallback(null, state);
        }
      },
      "INTERNMANAGER": {
        id: "INTERNMANAGER",
        title: "Hire junior recruiter",
        tooltipText: "Hire a overly enthusiastic recruiting manager",
        scoreLabel: "Junior recruiters",
        logMessage: "I am a specialist IT Head-Hunter currently recruiting bla bla bla",
        isButton: true,
        localStorage: load("INTERNMANAGER"),
        disabledTime: load("INTERNMANAGER").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state) => {
          return isDisplayed("INTERNMANAGER", state.actions)
        },
        isButtonEnabled: (state) => {
          return isEnabled("INTERNMANAGER", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          updateCallback(state["INTERNMANAGER"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          updateCallback(null, state);
        }
      },
    }
  };
}
