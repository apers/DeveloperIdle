import {load, save} from "./storageUtil";
import {CURRENT_VERSION, migrate} from "./migrationUtil";
import * as React from "react";
import App from "../App";

export function loadState() {
  migrate();
  if (!load("lastVisited")) {
    initializeGameStateStorage();
  }
  return initializeState();
}

function isDisplayed(resourceName, state, updateCallback) {
  let resourceStorage = state[resourceName].localStorage;
  let costStorage = state[resourceStorage.cost.name].localStorage;

  if (costStorage.value.current >= resourceStorage.cost.displayAtValue && !resourceStorage.hasBeenVisible) {
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
      current: 20000,
      allTime: 0,
      production: 1000,
    },
    cost: {
      name: "LOC",
      amount: 100,
      displayAtValue: 0,
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
      tickDelay: 1,
      name: "NOK",
      amount: 10,
      costName: "LOC",
      cost: 1,
    },
  });

  save("INTERN", {
    hasBeenVisible: false,
    disabledTime: 2 * 60,
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
      tickDelay: 1,
      name: "LOC",
      amount: 2,
      costName: "NOK",
      cost: 0,
    }
  });

  save("ALEX", {
    hasBeenVisible: false,
    disabledTime: 4 * 60,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
    },
    cost: {
      name: "NOK",
      amount: 250000,
      displayAtValue: 100000,
    },
    production: {
      tickDelay: 10,
      tick: 0,
      name: "SPAM",
      amount: 1,
      costName: "NOK",
      cost: 0,
    },
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
      displayAtValue: 150000,
    },
    production: {
      tickDelay: 20,
      tick: 0,
      name: "INTERN",
      amount: 1,
      costName: "NOK",
      cost: 0,
    },
  });

  save("LEVERAGE", {
    hasBeenVisible: false,
    disabledTime: 5,

    value: {
      current: 0,
      allTime: 0,
      production: 100,
    },
    cost: {
      name: "NOK",
      amount: 100000,
      displayAtValue: 1000000,
    },
  });

  save("LOBBYIST", {
    hasBeenVisible: false,
    disabledTime: 6 * 60,
    value: {
      current: 0,
      allTime: 0,
      production: 1,
    },
    cost: {
      name: "NOK",
      amount: 10000000,
      displayAtValue: 7000000,
    },
    production: {
      name: "LEVERAGE",
      amount: 100,
      costName: "NOK",
      cost: 0,
    }
  });

  save("BLOOD", {
    hasBeenVisible: false,
    disabledTime: 0,
    value: {
      current: 0,
      allTime: 0,
      production: 5,
    },
    cost: {
      name: "INTERN",
      amount: 1,
      displayAtValue: 0,
    },
    production: {
      name: "BLOOD",
      amount: 5,
      costName: "NOK",
      cost: 0,
    }
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
  save("FEEDINGTUBE", {
    active: false,
    hasBeenVisible: false,
  });
  save("DEITY", {
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
        tooltipText: <div><p>Get a prescription for adderall.</p><p>You produce 25 LOC every click.</p>
          <p>Cost: 5000 NOK</p></div>,
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

          if (nokStorage.value.current >= 3000 && !state.upgrades["ADDERALL"].localStorage.hasBeenVisible) {
            state.upgrades["ADDERALL"].localStorage.hasBeenVisible = true;
            updateCallback(null, state);
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
        tooltipText: <div><p>Roy makes you adopt functional programming.</p>
          <p>More software in fewer lines. You sell your LOC for double price.</p><p>Cost: 15000 NOK</p></div>,
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

          if (nokStorage.value.current >= 10000 && !state.upgrades["FUNCTIONAL"].localStorage.hasBeenVisible) {
            state.upgrades["FUNCTIONAL"].localStorage.hasBeenVisible = true;
            updateCallback(null, state);
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
        tooltipText: <div><p>Alexander moves your spam bots to AWS doubling their production.</p><p>Cost: 30000 NOK</p>
        </div>,
        logMessage: "I love the smell of server configuration in the morning!",
        localStorage: load("CLOUD"),
        clickFunction: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;
          const spamBotStorage = state.actions["SPAM"].localStorage;
          state.upgrades["CLOUD"].localStorage.active = true;

          nokStorage.value.current -= 30000;

          spamBotStorage.production.amount = 20;
          spamBotStorage.production.cost = 2;

          updateCallback(state.upgrades["CLOUD"].logMessage, state);
        },
        isButtonDisplayed: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;

          if (nokStorage.value.current >= 30000 && !state.upgrades["CLOUD"].localStorage.hasBeenVisible) {
            state.upgrades["CLOUD"].localStorage.hasBeenVisible = true;
            updateCallback(null, state);
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
      "FEEDINGTUBE": {
        id: "FEEDINGTUBE",
        title: "Pneumatic feeding tubes",
        tooltipText: <div><p>Install a pneumatic pellet feeding system for your developers.</p>
          <p>Doubles the production of your summer interns.</p><p>Cost: 150000 NOK</p></div>,
        logMessage: "Mmmmmmmmmm... nutritious pellets.",
        localStorage: load("FEEDINGTUBE"),
        clickFunction: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;
          const internStorage = state.actions["INTERN"].localStorage;
          state.upgrades["FEEDINGTUBE"].localStorage.active = true;

          nokStorage.value.current -= 150000;

          internStorage.production.amount *= 2;

          updateCallback(state.upgrades["FEEDINGTUBE"].logMessage, state);
        },
        isButtonDisplayed: (state, updateCallback) => {
          const nokStorage = state.actions["NOK"].localStorage;

          if (nokStorage.value.current >= 100000 && !state.upgrades["FEEDINGTUBE"].localStorage.hasBeenVisible) {
            state.upgrades["FEEDINGTUBE"].localStorage.hasBeenVisible = true;
            updateCallback(null, state);
          }

          return state.upgrades["FEEDINGTUBE"].localStorage.hasBeenVisible && !state.upgrades["FEEDINGTUBE"].localStorage.active;
        },
        isButtonEnabled: (state) => {
          const nokStorage = state.actions["NOK"].localStorage;
          return nokStorage.value.current >= 150000;
        },
        isUpgradeActive: (state) => {
          return state.upgrades["FEEDINGTUBE"].active;
        },
      },
      "DEITY": {
        id: "DEITY",
        title: "Get religious status",
        tooltipText: <div><p>Use your political leverage to get your company official religious status. Making Roy a deity in the Church of Higher Order Functions.</p>
          <p>Cost: 2000 political leverage</p></div>,
        logMessage: "Turns out atheism was to simple.",
        localStorage: load("DEITY"),
        clickFunction: (state, updateCallback) => {
          const leverageStorage = state.actions["LEVERAGE"].localStorage;
          state.upgrades["DEITY"].localStorage.active = true;

          leverageStorage.value.current -= 2000;

          // Effect
          updateCallback(state.upgrades["DEITY"].logMessage, state);
        },
        isButtonDisplayed: (state, updateCallback) => {
          const leverageStorage = state.actions["LEVERAGE"].localStorage;

          if (leverageStorage.value.current >= 1000 && !state.upgrades["DEITY"].localStorage.hasBeenVisible) {
            state.upgrades["DEITY"].localStorage.hasBeenVisible = true;
            updateCallback(null, state);
          }

          return state.upgrades["DEITY"].localStorage.hasBeenVisible && !state.upgrades["DEITY"].localStorage.active;
        },
        isButtonEnabled: (state) => {
          const leverageStorage = state.actions["LEVERAGE"].localStorage;
          return leverageStorage.value.current >= 2000;
        },
        isUpgradeActive: (state) => {
          return state.upgrades["DEITY"].active;
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
        logMessage: "I am contacting you for a business opportunity!",
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

          if (spamStorage.value.current !== 0 && locStorage.value.current >= spamStorage.production.cost) {
            let botsThatCanSell = Math.floor(locStorage.value.current / spamStorage.production.cost);
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
      "ALEX": {
        id: "ALEX",
        title: "Hire FSB Agents",
        tooltipText: <div><p>Get your old friend Alexander Bortnikov to take care of all your spambot needs.</p></div>,
        scoreLabel: "FSB Agents",
        logMessage: "Ваше здоровье!",
        isButton: true,
        localStorage: load("ALEX"),
        disabledTime: load("ALEX").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state, updateCallback) => {
          return isDisplayed("ALEX", state.actions, updateCallback)
        },
        isButtonEnabled: (state) => {
          return isEnabled("ALEX", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const alexStorage = state.actions["ALEX"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;

          alexStorage.value.current += alexStorage.value.production;
          alexStorage.value.allTime += alexStorage.value.production;

          nokStorage.value.current -= alexStorage.cost.amount;

          updateCallback(state.actions["ALEX"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          const alexStorage = state.actions["ALEX"].localStorage;
          const spamStorage = state.actions["SPAM"].localStorage;

          alexStorage.production.tick++;
          if (alexStorage.production.tick >= alexStorage.production.tickDelay) {
            alexStorage.production.tick = 0;
            spamStorage.value.current += alexStorage.value.current * alexStorage.production.amount;
            spamStorage.value.allTime += alexStorage.value.current * alexStorage.production.amount;

            updateCallback(null, state);
          }
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

          internManagerStorage.production.tick++;
          if (internManagerStorage.production.tick >= internManagerStorage.production.tickDelay) {
            internManagerStorage.production.tick = 0;
            internStorage.value.current += internManagerStorage.value.current * internManagerStorage.production.amount;
            internStorage.value.allTime += internManagerStorage.value.current * internManagerStorage.production.amount;

            updateCallback(null, state);
          }
        }
      },
      "LEVERAGE": {
        id: "LEVERAGE",
        title: "Canvassing",
        tooltipText: "Do some canvassing to gain political leverage",
        scoreLabel: "Political leverage",
        logMessage: "Do you have a minute to talk about our lord and savior?",
        isButton: true,
        localStorage: load("LEVERAGE"),
        disabledTime: load("LEVERAGE").disabledTime,
        hasTickFunction: false,
        isButtonDisplayed: (state, updateCallback) => {
          return isDisplayed("LEVERAGE", state.actions, updateCallback)
        },
        isButtonEnabled: (state) => {
          return isEnabled("LEVERAGE", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const leverageStore = state.actions["LEVERAGE"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;

          nokStorage.value.current -= leverageStore.cost.amount;

          leverageStore.value.current += leverageStore.value.production;
          leverageStore.value.allTime += leverageStore.value.production;
          updateCallback(state.actions["LEVERAGE"].logMessage, state);
        },
        tickFunction: () => {
        }
      },
      "LOBBYIST": {
        id: "LOBBYIST",
        title: "Hire a lobbyist to gain political leverage",
        tooltipText: "Hire a lobbyist to gain political leverage.",
        scoreLabel: "Lobbyists",
        logMessage: "To the java mines code monkey..",
        isButton: true,
        localStorage: load("LOBBYIST"),
        disabledTime: load("LOBBYIST").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state, updateCallback) => {
          return isDisplayed("LOBBYIST", state.actions, updateCallback)
        },
        isButtonEnabled: (state) => {
          return isEnabled("LOBBYIST", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const lobbyistStorage = state.actions["LOBBYIST"].localStorage;
          const nokStorage = state.actions["NOK"].localStorage;

          lobbyistStorage.value.current += lobbyistStorage.value.production;
          lobbyistStorage.value.allTime += lobbyistStorage.value.production;

          nokStorage.value.current -= lobbyistStorage.cost.amount;

          updateCallback(state.actions["LOBBYIST"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
          const lobbyistStorage = state.actions["LOBBYIST"].localStorage;
          const leverageStorage = state.actions["LEVERAGE"].localStorage;

          leverageStorage.value.current += lobbyistStorage.value.current * lobbyistStorage.production.amount;
          leverageStorage.value.allTime += lobbyistStorage.value.current * lobbyistStorage.production.amount;

          updateCallback(null, state);
        }
      },
      "BLOOD": {
        id: "BLOOD",
        title: "Sacrifice",
        tooltipText: "Sacrifice a summer intern to Roy god of Monads.",
        scoreLabel: "Virgin blood",
        logMessage: "Reliable old human sacrifice",
        isButton: true,
        localStorage: load("BLOOD"),
        disabledTime: load("BLOOD").disabledTime,
        hasTickFunction: true,
        isButtonDisplayed: (state, updateCallback) => {
          console.log(state.upgrades["DEITY"].localStorage.active);
          return state.upgrades["DEITY"].localStorage.active;
        },
        isButtonEnabled: (state) => {
          return isEnabled("BLOOD", state.actions);
        },
        clickFunction: (state, updateCallback) => {
          const bloodStorage = state.actions["BLOOD"].localStorage;
          const internStorage = state.actions["INTERN"].localStorage;

          bloodStorage.value.current += bloodStorage.value.production;
          bloodStorage.value.allTime += bloodStorage.value.production;

          internStorage.value.current -= bloodStorage.cost.amount;

          updateCallback(state.actions["BLOOD"].logMessage, state);
        },
        tickFunction: (state, updateCallback) => {
        }
      },
    }
  };
}

export function getScoreLabel(actionName, state) {
  return state.actions[actionName].scoreLabel;
}
