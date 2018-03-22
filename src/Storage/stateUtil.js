import {load, save} from "./storageUtil";
import {CURRENT_VERSION, migrate} from "./migrationUtil";
import * as React from "react";
import App from "../App";

export function loadState() {
  if (!load("lastVisited")) {
    initializeGameStateStorage();
  }

  migrate();
  return initializeState();
}

function isDisplayed(resourceName, state, updateCallback) {
  let resourceStorage = state[resourceName].localStorage;
  let costStorage = state[resourceStorage.cost.name].localStorage;

  if(costStorage.value.current >= resourceStorage.cost.displayAtValue && !resourceStorage.hasBeenVisible) {
    resourceStorage.hasBeenVisible = true;
  }

  return resourceStorage.hasBeenVisible;
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
    hasBeenVisible: true,
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
    hasBeenVisible: false,
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

  save("SPAM", {
    hasBeenVisible: false,
    disabledTime: 60,
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
      name: "NOK",
      amount: 10,
      costName: "LOC",
      cost: 1,
    },
  });

  save("INTERN", {
    hasBeenVisible: false,
    disabledTime: 30,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
    },
    cost: {
      name: "NOK",
      amount: 30000,
      displayAtValue: 20000,
    },
    production: {
      name: "LOC",
      amount: 5,
      costName: "NOK",
      cost: 0,
    }
  });

  save("INTERNMANAGER", {
    hasBeenVisible: false,
    disabledTime: 4 * 60,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
    },
    cost: {
      name: "NOK",
      amount: 500000,
      displayAtValue: 100000,
    },
    production: {
      name: "INTERN",
      amount: 1,
      costName: "NOK",
      cost: 10000,
    },
  });

  save("ADDERALL", {
    active: false,
    hasBeenVisible: false,
  });
  save("FUNCTIONAL", {
    active: false,
    hasBeenVisible: false,
  });
  save("CLOUD", {
    active: false,
    hasBeenVisible: false,
  });
}

export function initializeState() {
  return {
    upgrades: {
      "ADDERALL": {
        id: "ADDERALL",
        title: "Adderall",
        tooltipText: <div><p>Get a prescription for adderall.</p><p>You produce 25 LOC every click.</p><p>Cost: 5000 NOK</p></div>,
        logMessage: "Side effects include loss of appetite, weight loss, dry mouth, stomach upset/pain, nausea/vomiting, dizziness....",
        localStorage: load("ADDERALL"),
        clickFunction: (state, updateCallback) => {
          const locStorage = state.actions["LOC"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;
          state.upgrades["ADDERALL"].localStorage.active = true;

          nokStorage.value.current -= 5000;

          locStorage.value.production = 25;
          updateCallback(state.upgrades["ADDERALL"].logMessage, state);
        },
        isButtonDisplayed: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;

          if(nokStorage.value.current >= 3000 && !state.upgrades["ADDERALL"].localStorage.hasBeenVisible) {
            state.upgrades["ADDERALL"].localStorage.hasBeenVisible = true;
            updateCallback(state.upgrades["FUNCTIONAL"].logMessage, state);
          }

          return state.upgrades["ADDERALL"].localStorage.hasBeenVisible && !state.upgrades["ADDERALL"].localStorage.active;
        },
        isButtonEnabled: (state) => {
          const nokStorage = state.actions["NOK"].localStorage;
          return nokStorage.value.current >= 5000;
        },
        isUpgradeActive: (state) => {
          return state.upgrades["ADDERALL"].active;
        },
      },
      "FUNCTIONAL": {
        id: "FUNCTIONAL",
        title: "Functional Programming",
        tooltipText: <div><p>Roy makes you adopt functional programming.</p><p>More software in fewer lines. You sell your LOC for double price.</p><p>Cost: 15000 NOK</p></div>,
        logMessage: "Lets spend more time thinking than typing..",
        localStorage: load("FUNCTIONAL"),
        clickFunction: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;
          state.upgrades["FUNCTIONAL"].localStorage.active = true;

          nokStorage.value.current -= 15000;
          nokStorage.value.production *= 2;

          updateCallback(state.upgrades["FUNCTIONAL"].logMessage, state);
        },
        isButtonDisplayed: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;

          if(nokStorage.value.current >= 10000 && !state.upgrades["FUNCTIONAL"].localStorage.hasBeenVisible) {
            state.upgrades["FUNCTIONAL"].localStorage.hasBeenVisible = true;
            updateCallback(state.upgrades["FUNCTIONAL"].logMessage, state);
          }

          return state.upgrades["FUNCTIONAL"].localStorage.hasBeenVisible && !state.upgrades["FUNCTIONAL"].localStorage.active;
        },
        isButtonEnabled: (state) => {
          const nokStorage = state.actions["NOK"].localStorage;
          return nokStorage.value.current >= 15000;
        },
        isUpgradeActive: (state) => {
          return state.upgrades["FUNCTIONAL"].active;
        },
      },
      "CLOUD": {
        id: "CLOUD",
        title: "Spam cloud",
        tooltipText: <div><p>Roy makes you adopt functional programming.</p><p>More software in fewer lines. You sell your LOC for double price.</p><p>Cost: 15000 NOK</p></div>,
        logMessage: "Lets spend more time thinking than typing..",
        localStorage: load("CLOUD"),
        clickFunction: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;
          state.upgrades["CLOUD"].localStorage.active = true;

          nokStorage.value.current -= 15000;
          nokStorage.value.production *= 2;

          updateCallback(state.upgrades["CLOUD"].logMessage, state);
        },
        isButtonDisplayed: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;

          if(nokStorage.value.current >= 10000 && !state.upgrades["CLOUD"].localStorage.hasBeenVisible) {
            state.upgrades["CLOUD"].localStorage.hasBeenVisible = true;
            updateCallback(state.upgrades["CLOUD"].logMessage, state);
          }

          return state.upgrades["CLOUD"].localStorage.hasBeenVisible && !state.upgrades["CLOUD"].localStorage.active;
        },
        isButtonEnabled: (state) => {
          const nokStorage = state.actions["NOK"].localStorage;
          return nokStorage.value.current >= 15000;
        },
        isUpgradeActive: (state) => {
          return state.upgrades["CLOUD"].active;
        },
      },
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
        isButtonDisplayed: (state, updateCallback) => {
          return isDisplayed("NOK", state.actions, updateCallback);
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
        logMessage: "I am contacting you for business opportunity!",
        isButton: true,
        localStorage: load("SPAM"),
        disabledTime: load("SPAM").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state, updateCallback) => {
          return isDisplayed("SPAM", state.actions, updateCallback)
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
            botsThatCanSell = Math.min(botsThatCanSell, spamStorage.value.current);

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
        logMessage: "To the java mines code monkey..",
        isButton: true,
        localStorage: load("INTERN"),
        disabledTime: load("INTERN").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state, updateCallback) => {
          return isDisplayed("INTERN", state.actions, updateCallback)
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
        isButtonDisplayed: (state, updateCallback) => {
          return isDisplayed("INTERNMANAGER", state.actions, updateCallback)
        },
        isButtonEnabled: (state) => {
          return isEnabled("INTERNMANAGER", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const internManagerStorage = state.actions["INTERNMANAGER"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;

          internManagerStorage.value.current += internManagerStorage.value.production;
          internManagerStorage.value.allTime += internManagerStorage.value.production;

          nokStorage.value.current -= internManagerStorage.cost.amount;

          updateCallback(state.actions["INTERNMANAGER"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          const internManagerStorage = state.actions["INTERNMANAGER"].localStorage;
          const internStorage = state.actions["INTERN"].localStorage;

          internStorage.value.current += internManagerStorage.value.current * internManagerStorage.production.amount;
          internStorage.value.allTime += internManagerStorage.value.current * internManagerStorage.production.amount;

          updateCallback(null, state);
        }
      },
    }
  };
}

export function getScoreLabel(actionName, state) {
  return state.actions[actionName].scoreLabel;
}
