import {load, save} from "./storageUtil";
import {CURRENT_VERSION, migrate} from "./migrationUtil";

export function loadState() {
  if (!load("lastVisited")) {
    initializeGameStateStorage();
  }

  migrate();
  return initializeState();
}

function payAndAddResource(addResourceName, costResourceName, state) {
  const addResource = state[addResourceName].localStorage;

  addResource.value.current += addResource.value.production;
  addResource.value.allTime += addResource.value.production;

  if (costResourceName && addResource.cost.name) {
    const costResource = state[costResourceName].localStorage;
    costResource.value.current -= addResource.cost.amount;
  }
}

function tickFunction(tickResourceName, state) {
  let tickResource = state[tickResourceName].localStorage;
  let productionResource = state[tickResource.value.producesResources].localStorage;

  productionResource.value.current += tickResource.value.production * tickResource.value.current;
  productionResource.value.allTime += tickResource.value.production * tickResource.value.current;
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
      name: null,
      amount: 0,
      displayAtValue: 0,
    },
  });

  save("NOK", {
    disabledTime: 5,
    value: {
      current: 0,
      allTime: 0,
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
      producesResources: "LOC",
    },
    cost: {
      name: "NOK",
      amount: 10000,
      displayAtValue: 5000,
    },
  });

  save("INTERNMANAGER", {
    disabledTime: 2 * 60,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
      producesResources: "INTERN",
    },
    cost: {
      name: "NOK",
      amount: 20000,
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
          payAndAddResource("LOC", null, state.actions);
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
          payAndAddResource("NOK", "LOC", state.actions);
          updateCallback(state.actions["NOK"].logMessage, state);
        },
        tickFunction: () => {
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
          payAndAddResource("INTERN", "NOK", state.actions);
          updateCallback(state.actions["INTERN"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          tickFunction("INTERN", state.actions);
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
          payAndAddResource("INTERNMANAGER", "NOK", state.actions);
          updateCallback(state["INTERNMANAGER"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          tickFunction("INTERNMANAGER", state.actions);
          updateCallback(null, state);
        }
      },
    }
  };
}
