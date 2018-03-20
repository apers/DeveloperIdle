import React, {Component} from 'react';
import './App.css';
import TimedButton from "./UI/TimedButton";
import {
  decrementValue, incrementValue, initializeStorage, load, loadConfigFromStorage, loadNumber, loadState,
  save, updateLocalStorage
} from "./Storage/storageUtil";
import Log from "./UI/Log";
import Buttons from "./Buttons";
import Statistics from "./Statistics";

class App extends Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {
      loaded: true,
      logMessages: [],
      gameState: loadState(),
    };

    setInterval(() => {
      let gameState = this.state.gameState;
      for (let key in gameState) {
        let action = gameState[key];
        if(action.hasTickFunction) {
          action.tickFunction(gameState)

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

  handleButtonClick(message, newState) {
    this.state.logMessages.unshift(message);
    let oldLog = this.state.logMessages.slice(0,20);

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
                  updateCallback={this.handleButtonClick}
                  state={this.state.gameState}
              />
            </div>
            <div className="container stats">
              <Statistics
                  onClick={this.handleButtonClick}
                  state={this.state.gameState}
              />
            </div>
          </div>
      );
    }
  }
}

export default App;
