import React, {Component} from 'react';
import Log from "./UI/Log";
import Buttons from "./Buttons";
import Statistics from "./Statistics";
import {updateLocalStorage} from "./Storage/storageUtil";
import {loadState} from "./Storage/stateUtil";
import './App.css';
import Upgrades from "./Upgrades";

class App extends Component {
  constructor(props) {
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);

    this.state = {
      loaded: true,
      logMessages: [],
      gameState: loadState(),
    };

    setInterval(() => {
      let gameState = this.state.gameState;
      for (let key in gameState.actions) {
        let action = gameState.actions[key];
        if (action.hasTickFunction) {
          action.tickFunction(gameState, this.handleUpdate);

          this.setState({
            gameState: gameState,
          })
        }
      }
    }, App.getTickTime())
  }

  static getTickTime() {
    return 500;
  }

  handleUpdate(message, newState) {

    if (message) {
      this.state.logMessages.unshift(message);
    }
    let oldLog = this.state.logMessages.slice(0, 20);

    this.setState({
      logMessages: oldLog,
      gameState: newState,
    });

    updateLocalStorage(newState);
  }

  render() {
    const {
      logMessages
    } = this.state;

    if (!this.state.loaded) {
      return null;
    }
    else {
      return (
          <div className="App">
            <div className="container log">
              <h2>Log</h2>
              <Log logMessages={logMessages}/>
            </div>
            <div className="container buttons">
              <Buttons
                  updateCallback={this.handleUpdate}
                  state={this.state.gameState}
              />
              <Upgrades
                  updateCallback={this.handleUpdate}
                  state={this.state.gameState}
              />
            </div>
            <div className="container stats">
              <Statistics
                  state={this.state.gameState}
              />
            </div>
          </div>
      );
    }
  }
}

export default App;
