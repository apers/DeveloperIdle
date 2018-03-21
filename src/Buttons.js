import React, {Component} from "react";
import PropTypes from "prop-types";
import './App.css';
import TimedButton from "./UI/TimedButton";
import {getScoreLabel} from "./Storage/stateUtil";

class Buttons extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      state,
      updateCallback,
    } = this.props;

    const {} = this.state;

    const buttonsJsx = [];

    for (let key in state.actions) {
      const action = state.actions[key];

      let productionInfo = null;

      if (action.localStorage.production && action.localStorage.production.costName) {
        productionInfo = (
            <div>
              {
                "Exchanges " +
                action.localStorage.production.cost +
                " " +
                getScoreLabel(action.localStorage.production.costName, state) +
                " for " +
                action.localStorage.production.amount +
                " " +
                getScoreLabel(action.localStorage.production.name, state) +
                " every tick"
              }
            </div>
        );
      }

      const tooltip =
          <div>
            <div>{action.tooltipText}</div>
            <div>{"Cost: " + action.localStorage.cost.amount + " " + action.localStorage.cost.name}</div>
            <div>{"Produces: " + action.localStorage.value.production + " " + action.scoreLabel}</div>
            {productionInfo}
          </div>;

      if (action.isButton && action.isButtonDisplayed(state)) {
        buttonsJsx.push(
            <TimedButton
                key={action.id}
                tooltip={tooltip}
                onClick={() => action.clickFunction(state, updateCallback)}
                disabledTime={action.disabledTime}
                title={action.title}
                id={action.id}
                disabled={!action.isButtonEnabled(state)}
                logMessage={action.logMessage}
            />
        );
      }
    }

    return (
        <div className="Buttons">
          <h2>Actions</h2>
          {buttonsJsx}
        </div>
    );
  }
}

Buttons.propTypes = {
  state: PropTypes.object,
  updateCallback: PropTypes.func,
};

Buttons.defaultProps = {
  state: {},
  updateCallback: () => {

  }
};

export default Buttons;
